<template>
  <div class="new-list" :style="editingNewList ? 'opacity:1' : 'opacity:0.7'">
    <a v-if='!editingNewList' @click='startEditing'>
      <h6><span style='font-weight:900'>+</span> Add a new list</h6>
    </a>
    <input placeholder="Enter list title..." ref='listTitle' v-if='editingNewList' v-model='listTitle' class="new-list-card">
    <div>
      <button v-if='editingNewList' @click="submitList" class="btn btn-success">Add List</button>
      <a v-if='editingNewList' @click='editingNewList=false'>✖️</a>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      editingNewList: false,
      listTitle: ''
    }
  },
  methods: {
    startEditing: function() {
      this.editingNewList = true
      this.$nextTick(() => { this.$refs.listTitle.focus() })
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
    this.$eventBus.$on('activateSaving', () => {
      if (this.editingNewList) {
        this.submitList()
      }
    });
  },
}
</script>

<style lang="css" scoped>

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

</style>
