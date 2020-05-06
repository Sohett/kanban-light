<template>
  <div class='list' @mouseover='deleteListVisible = true' @mouseleave='deleteListVisible = false'>
    <div class="row">
      <h6 class="col-10">{{ list.name }}</h6>
      <a v-if='deleteListVisible' @click='removeList' class="col-1 delete-list">🗑️</a>
    </div>
    <draggable
      v-model="list.cards"
      :options="{group: 'cards'}"
      class="dragArea"
      @start="drag = true"
      @end="cardMoved"
      v-bind="dragOptions"
      :disabled="editingMode"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <card
          v-for="(card, index) in list.cards"
          :key="card.name"
          :card='card'
          :list='list'
        ></card>
      </transition-group>
    </draggable>

    <button v-if='!editingList' @click='startEditing' class='add_card'><b>+</b> Add another card</button>
    <textarea
      ref='message'
      placeholder="Enter a title for this card"
      v-if='editingList'
      v-model="message"
      name="new_card"
      class="form-control mb-2 trello_style-card"
    >
      </textarea>
    <button v-if='editingList' @click="addCardToList" class="btn btn-success">Add Card</button>
    <a v-if='editingList' @click='editingList=false'>✖️</a>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import card from './card'

export default {
  components: { card, draggable },
  props: ['list'],
  data: function() {
    return {
      message: '',
      drag: false,
      editingList: false,
      editingMode: false,
      deleteListVisible: false
    }
  },
  created() {
    this.$eventBus.$on('exitAllEditing', () => {
      this.editingList = false;
    });
    this.$eventBus.$on('activateEditingMode', () => {
      this.editingMode = true;
    });
    this.$eventBus.$on('deactivateEditingMode', () => {
      this.editingMode = false;
    });
    this.$eventBus.$on('activateSaving', () => {
      if (this.editingList) {
        this.addCardToList()
      }
    });
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    cardMoved: function(id, event) {
      this.drag = false;
      console.log(id, event)
      //
      // const list_index = window.store.lists.findIndex((list) => {
      //   return list.cards.find((card) => {
      //     console.log(event)
      //     // return card.id === event.element.id
      //   })
      // })
    },
    startEditing :function() {
      this.editingList = true
      this.$nextTick(() => { this.$refs.message.focus() })
    },
    addCardToList: function() {
      let data = new FormData
      data.append("card[list_id]", this.list.id)
      data.append("card[name]", this.message)

      Rails.ajax({
        url: "/cards",
        type: "POST",
        data: data,
        dataType: 'json',
        success: (data) => {
          this.$store.commit('addCardToList', data)
          this.message = ''
          this.editingList = false
        }
      })
    },
    removeList: function() {
      if (confirm(`Please confirm the deletion of the "${this.list.name.toUpperCase()}" list.\n\n🚨All the related cards of this list will be destroyed in the process !`)) {
        Rails.ajax({
          url: `/lists/${this.list.id}`,
          type: "DELETE",
          dataType: 'json',
          success: (data) => {
            this.$store.commit('removeList', this.list.id)
          }
        })
      }
    }
  }
}

</script>

<style scoped>

a {
  margin-left: 5px;
}

h6 {
  font-weight: bolder;
}

.add_card {
  width: 250px;
  text-align: left;
  padding: 7px;
  border: 0px;
  background: #ebecf0;
}

.add_card:focus {
  outline: 0;
}

.add_card:hover {
  background: #d4d6da;
  border-radius: 3px;
}

.no-move {
  transition: transform 0s;
}

.dragArea {
  min-height: 20px;
}

.trello_style-card {
  box-shadow: 1px 2px 4px #d6d6da;
  border: 0px;
  margin-bottom: 10px;
  cursor:grab;
  padding: 0.7rem;
  border-radius: 3px;
}

.trello_style-card::-webkit-input-placeholder {
  font-size: 15px;
  letter-spacing: -0.02em;
  word-spacing: -0.07em;
}

.ghost {
  opacity: 1.0;
  background: #f4f4f4;
}

.list {
  cursor:grab;
  background: #ebecf0;
  display: inline-block;
  border-radius: 3px;
  vertical-align: top;
  margin-right: 10px;
  width: 270px;
  margin-top: 40px;
  padding: 10px;
  margin-bottom: 50px;
}

.list:first-child {
  margin-left: 10px;
}

.delete-list {
  font-size: 10px;
}
</style>
