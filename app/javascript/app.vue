<template>
  <draggable v-model="lists" :options="{group: 'lists'}" class="board dragArea" id="app" @end="listMoved" :disabled="editingMode">
    <list v-for="(list, index) in lists" :list='list' :key='list.id'></list>
    <new-list></new-list>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import list from './components/list'
import newList from './components/new_list'

export default {
  components: { draggable, list, newList },
  props: ["original_lists"],
  data: function() {
    return {
      lists: this.original_lists,
      editingMode: false
    }
  },
  methods: {
    listMoved: function(event) {
      let data = new FormData;
      data.append("list[position]", event.newIndex + 1);

      Rails.ajax({
        url: `/lists/${this.lists[event.newIndex].id}/move`,
        type: "PATCH",
        data: data,
        dataType: 'json'
      })
    }
  },
  created() {
    this.$eventBus.$on('activateEditingMode', () => {
      this.editingMode = true;
    });
    this.$eventBus.$on('deactivateEditingMode', () => {
      this.editingMode = false;
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
