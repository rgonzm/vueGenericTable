<template>
    <div>
        <div v-if="rows.length === 0">
            No hay datos
        </div>
        <div v-else="">
            <div class="field is-horizontal">
                    <div class="field-label column">
                        <label>Búsqueda</label>
                    </div>
                    <div class="field-body is-half">
                        <input class="input" placeholder="Ingrese la palabra a buscar" name="query" v-model="filterKey">
                    </div>
            </div>
            <table class="table is-fullwidth">
                <thead>
                <tr>
                    <td
                      @click="sortBy(index)"
                      v-for="(header,index) in headers">
                        <slot name="head">
                            <b>{{ header }}</b>
                        </slot>
                        <span class="fa" :class="sortOrders[index] > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></span>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in filterData">
                    <slot name="row">
                        <td v-for="value in row.values ">
                            {{ value }}
                        </td>
                    </slot>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      headers: {
        type: Array,
        required: true
      },
      rows: {
        type: Array,
        required: true
      }
    },
    data () {
      var sortOrders = {}
      this.headers.forEach(function (key,index) {
        sortOrders[index] = 1
      })
      return {
        filterKey: '',
        sortKey: '',
        sortOrders: sortOrders
      }
    },
    computed: {
      filterData () {
        let data = this.rows
        var sortKey = this.sortKey
        var order = this.sortOrders[sortKey] || 1
        var filterKey = this.filterKey && this.filterKey.toLowerCase()
        if (filterKey.length > 0) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(filterKey) > -1
            })
          })
        }
        if (sortKey >= 0) {
          data = data.slice().sort(function (a, b) {
            a = a.values[sortKey]
            b = b.values[sortKey]
            return (a === b ? 0 : a > b ? 1 : -1) * order
          })
        }
        return data
      }
    },
    methods: {
      sortBy(key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      },
    }
  }
</script>
