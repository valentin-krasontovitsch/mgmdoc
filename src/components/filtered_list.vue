<style>
  .labelled_input {
    max-width: 100%; /* hack for IE, not necessary in other browsers O_o */
    min-width: 80%;
  }
  .button-box {
    max-width: 50%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .mdl-badge.mdl-badge--overlap {
    margin: 0pt;
  }
  .spacy {
    margin: 5pt;
  }
  .quite-spacy {
    margin: 10pt;
  }
</style>

<template>
  <div class="flex-column labelled_input" :id="'input-' + id">
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input
         class="mdl-textfield__input"
         type="text"
         :id="id"
         @input="updateValue"
         autofocus
      >
      <label class="mdl-textfield__label" :for="id">{{ label }}</label>
    </div>
    <div class="button-box" v-if="noMatches">
      <button class="warning spacy mdl-button mdl-js-button mdl-button--raised
              mdl-button--accent" >
        {{ warningNoMatches }}
      </button>
    </div>
    <div class="button-box">
      <form
        formmethod="get"
        v-for="item, index in filteredList"
        style="display: inline"
        class="spacy"
        @mousemove="chosen = index" >
        <button
          :formaction="`${item.docs_url}`"
          :class="`complete mdl-button
            mdl-js-button mdl-button--raised
            ${index == chosen ? 'mdl-button--accent' : 'mdl-button--colored'
            }`"
            @mousemove="chosen = index"
            @focus="chosen = index"
            @blur="chosen = undefined" >
            {{ item.name }}
        </button>
      </form>
    </div>
    </div>
</template>

<script>

export default {
  props: {
    label: {
      type: String,
      default: 'Input'
    },
    id: {
      type: String,
      default: ''
    },
    dataUrl: {
      type: String,
      required: true
    }
  },
  data: () => ({
    chosen: undefined,
    noMatches: false,
    warningNoMatches: 'Unable to find any results matching query',
    fullList: [],
    filteredList: [],
    activeRequests: []
  }),
  computed: {
    displayLoader () {
      return this.activeRequests.length !== 0
    }
  },
  methods: {
    getUrl: function (url) {
      if (this.activeRequests) {
        this.activeRequests.push(undefined)
      }
      console.log(`running request for ${url}`)
      return this.$http.get(url)
        .then((response) => {
          if (this.activeRequests) {
            this.activeRequests.pop()
          }
          return response.data
        })
        .catch((error) => {
          if (this.activeRequests) {
            this.activeRequests.pop()
          }
          console.log(error)
        })
    },
    filterListByPartialInput: function (input) {
      const filteredList = this.fullList.filter(item => item.name.startsWith(input))
      if (filteredList.length === 0) {
        this.noMatches = true
        this.filteredList = this.fullList
      } else {
        this.noMatches = false
        this.filteredList = filteredList
      }
    },
    updateValue: function (event) {
      let input = event.target.value
      this.filterListByPartialInput(input)
    }
  },
  mounted () {
    this.$el.getElementsByTagName('input')[0].focus()
    this.getUrl(this.dataUrl).then(data => {
      var sortedData = data.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name
      )
      this.fullList = sortedData
      this.filteredList = sortedData
    })
  }
}
</script>
