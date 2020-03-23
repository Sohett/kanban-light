<template>
  <div>
    <div @click='startEditingCard' class="card card-body trello_style-card">
      <p>{{ card.name }}</p>
      <div v-if='card.labels.length' class="row labels">
        <div v-for="label in card.labels" :key="label.id" class="label-small">
          {{ label.name }}
        </div>
      </div>
    </div>

    <div v-if='editing' class="modal-backdrop show"></div>

    <div
      v-if='editing'
      class="modal show"
      @click='closeModalButton'
      style="display: block;"
    >
      <div class="modal-dialog">
        <div class="modal-content content" @click='closeEditTitle'>
          <div class="modal-header">
            <a v-if='!editingTitle' @click='startEditingTitle' class='edit-card-title'>
              <h5 class="modal-title">{{name}}</h5>
            </a>
            <textarea
              v-show='editingTitle'
              class="form-control card-title"
              v-model="name"
              :min-height="10"
              ref="editingTitleTextArea"
            ></textarea>
          </div>
          <div class="modal-body">
            <div v-if='card.labels.length' class="row labels">
              <div v-for="label in card.labels" :key="label.id">
                <div id='label' class="label">{{ label.name }}</div>
                <a id='delete_label' class="delete-label" @click='removeLabelfromCard(label.id)'>✖️</a>
              </div>
            </div>
            <br v-if='card.labels.length'>
            <p class='description-title' v-if='!editingDescription'>🗒️Description:</p>
            <p
              v-if='!editingDescription'
              class='description'
              v-html="description"></p>
            <textarea-autosize
              v-if='editingDescription'
              class="form-control card-description"
              v-model="description"
              :min-height="50"
            />
            <p class='hint' v-if='editingDescription' >💡You can use HTML and inline CSS to style your description.</p>
            <!-- editingDescription Button -->
            <div class="row" style="margin-left: 0px">
              <button
                v-if='!editingDescription'
                class="btn btn-sm btn-light"
                type="button"
                name="edit-description"
                @click='startEditingDescriptionCard'
              >
                <span>{{ editDescriptionButtonText }}</span>
              </button>

              <!-- Close EditingDescription Button -->
              <button
                v-if='editingDescription'
                class="btn btn-sm btn-light"
                type="button"
                name="edit-description"
                @click='closeEditingDescription'
              >
                <span>✖️Cancel Edit</span>
              </button>

              <!-- Add a label dropdown -->
              <select v-model="selectedLabel" name="labels" class="form-control form-control-sm labels-select" @change='addLabelToCard'>
                <option selected disabled>🏷️Select a label</option>
                <option v-for="label in availableLabels" :value="label.id" :key='label.id'>
                  {{ label.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <!-- Delete card button -->
            <button
              class="btn btn-light delete-card"
              type="button"
              name="delete-card"
              @click='deleteCard'
            >
              <span>🗑️Delete</span>
            </button>

            <!-- Save card button -->
            <button @click='saveCardButton' type="button" class="btn btn-success">💾Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['card', 'list'],
  name: 'card',
  data: function() {
    return {
      editing: false,
      editingTitle: false,
      editingDescription: false,
      name: this.card.name,
      description: this.card.description || '',
      labels: window.store.labels,
      selectedLabel: '🏷️Select a label'
    }
  },
  computed: {
    editDescriptionButtonText: function() {
      return this.card.description ? '🖋️Edit Description' : '🖋️Add a description...'
    },
    availableLabels: function() {
      var label_ids = this.card.labels.map(label => label.id)
      return  this.labels.filter(label => !label_ids.includes(label.id))
    }
  },
  created() {
    this.$eventBus.$on('exitAllEditing', () => {
      this.closeEditingTitleAndDescription();
      this.editing = false;
      this.$eventBus.$emit('deactivateEditingMode');
    });
    this.$eventBus.$on('activateSaving', () => {
      if (this.editingTitle || this.editingDescription) {
        this.saveCard();
        this.closeEditingTitleAndDescription();
      }
    });
  },
  methods: {
    startEditingCard: function() {
      this.editing = true;
      this.$eventBus.$emit('activateEditingMode');
    },
    startEditingDescriptionCard: function() {
      this.editingDescription = true;
    },
    closeEditingDescription: function() {
      this.description = this.card.description;
      this.editingDescription = false;
      document.activeElement.blur();
    },
    closeEditingTitleAndDescription: function () {
      this.editingTitle = false;
      this.editingDescription = false;
    },
    saveCardButton: function() {
      this.saveCard();
      this.closeEditingTitleAndDescription();
      this.closeModal();
    },
    saveCard: function() {
      const data = new FormData;
      data.append("card[name]", this.name);
      data.append("card[description]", this.description);

      Rails.ajax({
        url: `/cards/${this.card.id}`,
        type: 'PATCH',
        data: data,
        dataType: 'json',
        success: (data) => {
          const list_index = window.store.lists.findIndex((item) => item.id == this.list.id);
          const card_index = window.store.lists[list_index].cards.findIndex((item) => item.id == this.card.id);
          window.store.lists[list_index].cards.splice(card_index, 1, data);
        }
      })
    },
    closeModalButton: function(event) {
      if(event.target.classList.contains('modal')) {
        this.closeModal()
       }
    },
    closeModal: function(event) {
      this.editing = false
      this.$eventBus.$emit('deactivateEditingMode');
    },
    startEditingTitle: function() {
      this.editingTitle = true
      setTimeout(function () { this.$refs.editingTitleTextArea.focus() }.bind(this), 10)
    },
    closeEditTitle: function(event) {
      if (!event.target.classList.contains('modal-title') && !event.target.classList.contains('form-control')) { this.editingTitle = false }
    },
    deleteCard: function() {
      if (confirm(`🚨Please confirm the deletion of the "${this.card.name.toUpperCase()}" card.`)) {
        Rails.ajax({
          url: `/cards/${this.card.id}`,
          type: 'DELETE',
          dataType: 'json',
          success: (data) => {
            const list_index = window.store.lists.findIndex((item) => item.id == this.list.id);
            const card_index = window.store.lists[list_index].cards.findIndex((item) => item.id == this.card.id);
            window.store.lists[list_index].cards.splice(card_index, 1);

            this.editing = false
          }
        })
      }
    },
    addLabelToCard: function() {
      const data = new FormData
      data.append("card[label_id]", this.selectedLabel)

      Rails.ajax({
        url: `/cards/${this.card.id}/add_label`,
        type: 'PATCH',
        data: data,
        dataType: 'json',
        success: (data) => {
          const list_index = window.store.lists.findIndex((item) => item.id == this.list.id);
          const card_index = window.store.lists[list_index].cards.findIndex((item) => item.id == this.card.id);
          window.store.lists[list_index].cards[card_index].labels = data.labels;
          document.activeElement.blur()
          this.selectedLabel = '🏷️Select a label'
        }
      })
    },
    removeLabelfromCard: function(label_id) {
      const data = new FormData
      data.append("card[label_id]", label_id)

      Rails.ajax({
        url: `/cards/${this.card.id}/remove_label`,
        type: 'PATCH',
        data: data,
        dataType: 'json',
        success: (data) => {
          const list_index = window.store.lists.findIndex((item) => item.id == this.list.id);
          const card_index = window.store.lists[list_index].cards.findIndex((item) => item.id == this.card.id);
          window.store.lists[list_index].cards[card_index].labels = data.labels;
          document.activeElement.blur()
        }
      })
    }
  }
}
</script>

<style scoped>

.labels {
  margin-left: -5px;
  margin-right: -10px;
}

.label {
  background: #dee2e6;
  width: auto;
  max-width: 230px;
  word-break: break-word;
  white-space: normal;
  padding: 2px 18px 2px 10px;
  border-radius: 10px;
  text-align: center;
  margin: 5px;
  display: inline-block;
}

.label-small {
  font-size: 12px;
  background: #dee2e6;
  width: auto;
  word-break: break-word;
  white-space: normal;
  padding: 2px 18px 2px 10px;
  border-radius: 10px;
  text-align: center;
  margin: 2px;
  margin-top: 5px;
  display: inline-block;
}

.delete-label {
  font-size: 10px;
  margin-left: -22px;
  position: absolute;
  top: 25px;
  visibility: hidden;
}

#label:hover ~ #delete_label {
  visibility: visible;
}

#delete_label:hover {
  visibility: visible;
}

.trello_style-card {
  box-shadow: 1px 2px 4px #d6d6da;
  border: 0px;
  margin-bottom: 10px;
  cursor:grab;
  padding: 0.7rem;
  border-radius: 3px;
}

.trello_style-card p {
  font-weight: lighter;
  font-size: 15px;
  word-break: break-word;
  white-space: normal;
  letter-spacing: -0.02em;
  word-spacing: -0.07em;
}

.delete-card {
  color: #dc3546;
  border: 1px solid #dc3546;
}

.delete-card:hover {
  border: 1px solid #dc3546;
  color: white;
  background: #ef5351;
}

.labels-select {
  width: 150px;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 3px;
}

.modal-dialog {
  margin-top: 100px;
  cursor: default;
  overflow-y: initial !important
}

.modal-content {
  border-radius: 5px !important;
  overflow-y: scroll;
  max-height: 80vh;
  overflow-y: auto;
}

h5 {
  font-weight: bolder;
  word-break: break-word;
  white-space: normal;
}

.edit-card-title {
  cursor: text;
}

.card-title {
  font-family: "Nunito", "Helvetica", "sans-serif";
  font-size: 1.2rem;
  line-height: 1.4;
  font-weight: bolder;
  margin: 0px;
  padding: 5px;
  border-radius: 5px;
}

.card-description {
  margin-bottom: 10px;
  border-radius: 5px;
}

.description {
  word-break: break-word;
  white-space: normal;
  cursor: text;
  padding: 5px 0px;
  margin-bottom: 5px;
}

.hint {
  margin-top: -2px;
  font-style: italic;
  font-size: 10px;
}

.description-title {
  font-family: "Nunito", "Helvetica", "sans-serif";
  font-weight: 800;
  margin-bottom: 5px;
}

</style>
