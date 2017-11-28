<style>
  #labelled-input {
    padding-top: 8px;
  }
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
  .mdc-badge.mdc-badge--overlap {
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
    <div class="mdc-text-field mdc-js-text-field mdc-text-field--floating-label">
      <input
         class="mdc-text-field__input"
         type="text"
         :id="id"
         @input="updateValue"
         autofocus
      >
      <label class="mdc-textfield__label" :for="id">{{ label }}</label>
    </div>
    <div class="button-box" v-if="noMatches">
      <button class="warning spacy mdc-button mdc-js-button mdc-button--raised
              mdc-button--accent" >
        {{ warningNoMatches }}
      </button>
    </div>
    <div class="button-box">
      <div class="spacy"
        style="display: inline"
        v-for="item, index in filteredList"
        @mousemove="chosen = index" >
        <a
          :href="`${item.docs_url}`"
          :class="`complete mdc-button
            mdc-js-button mdc-button--raised
            ${index == chosen ? 'mdc-button--accent' : 'mdc-button--colored'
            }`"
            @mousemove="chosen = index"
            @focus="chosen = index"
            @blur="chosen = undefined" >
            {{ item.name }}
        </a>
      </div>
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
      default: 'labelled-input'
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
      const filteredList = this.fullList.filter(item => {
        console.log(input.toLowerCase())
        console.log(item.name)
        return item.name.startsWith(input.toLowerCase())
      })
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
      let lowerCaseData = data.map(dataPoint => {
        dataPoint.name = dataPoint.name.toLowerCase()
        return dataPoint
      })
      let sortedData = lowerCaseData.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name
      )
      this.fullList = sortedData
      this.filteredList = sortedData
    })
  }
}
</script>
