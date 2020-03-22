<template>
  <draggable v-model="lists" :options="{group: 'lists'}" class="board dragArea" id="app" @end="listMoved" :disabled="editingMode">
    <list v-for="(list, index) in lists" :list='list' :key='list.id'></list>

    <div class="new-list" :style="editingNewList ? 'opacity:1' : 'opacity:0.7'">
      <a v-if='!editingNewList' @click='startEditing'>
        <h6>➕Add a new list</h6>
      </a>
      <input placeholder="Enter list title..." ref='listTitle' v-if='editingNewList' v-model='listTitle' class="new-list-card">
      <div>
        <button v-if='editingNewList' @click="submitList" class="btn btn-success">Add List</button>
        <a v-if='editingNewList' @click='editingNewList=false'>✖️</a>
      </div>
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import list from './components/list'

export default {
  components: { draggable, list },
  props: ["original_lists"],
  data: function() {
    return {
      lists: this.original_lists,
      editingNewList: false,
      listTitle: '',
      editingMode: false
    }
  },
  methods: {
    startEditing: function() {
      this.editingNewList = true
      this.$nextTick(() => { this.$refs.listTitle.focus() })
    },
    listMoved: function(event) {
      let data = new FormData;
      data.append("list[position]", event.newIndex + 1);

      Rails.ajax({
        url: `/lists/${this.lists[event.newIndex].id}/move`,
        type: "PATCH",
        data: data,
        dataType: 'json'
      })
    },
    submitList: function() {
      let data = new FormData
      data.append("list[name]", this.listTitle)

      Rails.ajax({
        url: '/lists',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: (data) => {
          window.store.lists.push(data)
          this.editingNewList = false
          this.listTitle = ''
        }
      })
    }
  },
  created() {
    this.$eventBus.$on('exitAllEditing', () => {
      this.editingNewList = false;
      this.listTitle = ''
    });
    this.$eventBus.$on('activateEditingMode', () => {
      this.editingMode = true;
    });
    this.$eventBus.$on('deactivateEditingMode', () => {
      this.editingMode = false;
    });
    this.$eventBus.$on('activateSaving', () => {
      if (this.editingNewList) {
        this.submitList()
      }
    });
  },
  mounted () {
    this._keyListener = function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        this.$eventBus.$emit('exitAllEditing');
      } else if (e.keyCode === 13 && (e.metaKey || e.ctrlKey) ) {
        e.preventDefault();
        this.$eventBus.$emit('activateSaving');
      }
    }
    document.addEventListener('keydown', this._keyListener.bind(this))
  },
}
</script>

<style scoped>

.dragArea {
  min-height: 20px;
}

.new-list-card {
  margin-bottom: 10px;
  border-radius: 3px;
  width: 250px;
  text-align: left;
  padding: 7px;
  border: 0px;
  background: #ffffff;
}

.new-list {
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

.board {
  background-image: url("https://images.unsplash.com/photo-1514315153150-cd7d8d716178?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=5184&q=80 5184w");
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
  overflow-x: auto;
  white-space: nowrap;
  height: 100vh;
}

</style>
