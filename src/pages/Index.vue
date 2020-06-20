<template>
  <q-page>
    <q-toolbar class="bg-primary text-white">
        <q-btn
          flat
          dense
          round
          icon="fas fa-utensils"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Gerador de Cardápio 1.0
        </q-toolbar-title>
        <div>Athos mkt</div>
    </q-toolbar>

    <div class="q-pa-md">
      <q-card flat>
        <q-card-section>
          <p class="text-h6">Dados da empresa</p>
          <p>id: {{ id }}</p>
          <q-form>
            <div class="row q-col-gutter-lg">
              <div class="col-4">
                <q-input @input="updateEmpresa" v-model="empresa.nome" dense label="Nome" />
              </div>

              <div class="col-4">
                <q-input @input="updateEmpresa" v-model="empresa.categoria" dense label="Categoria" hint="exemplo: Hamburgueria" />
              </div>

              <div v-if="empresa.logoURL.length === 0" class="col-4">
                <q-file v-model="logo" dense label="Logo" hint="altura: 226px largura: 215px" @input="saveLogo" />
              </div>
              <div class="col-4" v-else>
                <p>Logo</p>
                <img :src="empresa.logoURL" width="100">
                <q-btn flat label="alterar" color="primary" @click="() => { empresa.logoURL = ''; logo = null }" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <br>

      <q-card flat>
        <q-card-section>
          <p class="text-h6">Rodapé</p>
          <q-form>
            <div class="row q-col-gutter-lg">
              <div class="col-6">
                <q-input @input="updateRodape" v-model="rodape.endereco" dense label="Endereço" />
              </div>

              <div class="col-3">
                <q-input @input="updateRodape" v-model="rodape.whatsapp" dense label="Whatsapp" />
              </div>

              <div class="col-3">
                <q-input @input="updateRodape" v-model="rodape.facebook" dense label="Facebook" />
              </div>

              <div class="col-3">
                <q-input @input="updateRodape" v-model="rodape.instagram" dense label="Instagram" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <br>

      <q-card flat>
        <q-card-section>
          <p class="text-h6">Categoria</p>
          <q-form ref="input" @submit="addCategoria">
            <div class="row q-col-gutter-lg">
              <div class="col-8">
                <q-input 
                  v-model="categoria" 
                  dense label="Nome da categoria"
                  lazy-rules
                  hint="exemplo: Lanches"
                  :rules="[val => !!val || 'Obrigatório']" 
                />
              </div>
              <div class="col-4">
                <q-btn type="submit" class="full-width" color="primary" label="adicionar categoria" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <br>

      <q-card class="bg-grey-5" flat v-for="(c, index) in categorias" :key="index" style="margin-bottom: 20px">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 flex flex-center" style="justify-content: space-between">
              <q-input v-model="c.nome" style="width: 400px" class="float-left" label="Categoria" @input="updateCategorias" />
              <q-btn flat class="float-right" label="Excluir categoria" color="negative" icon="far fa-trash-alt" />
            </div>

            <div class="col-4">
              <q-form ref="formulario" @submit="addItem(index)" class="q-pa-md bg-white">
                <q-file 
                  :rules="[val => !!val || 'Obrigatório']" 
                  lazy-rules 
                  v-model="itemFoto" 
                  dense 
                  label="Foto produto (proporção quadrada)"
                  @input="saveItemFoto" 
                />
                <q-input :rules="[val => !!val || 'Obrigatório']" lazy-rules v-model="item.nome" dense label="Nome produto" />
                <q-input :rules="[val => !!val || 'Obrigatório']" lazy-rules v-model="item.desc" dense label="Descrição" />
                <q-input :rules="[val => !!val || 'Obrigatório']" lazy-rules v-model="item.valor" dense label="Valor" />
                <q-btn type="submit" color="primary" label="adicionar item" class="full-width" />
              </q-form>
            </div>

            <div class="col-8">
              <q-markup-table separator="horizontal">
                <thead>
                  <tr>
                    <th class="text-left">Foto</th>
                    <th class="text-left">Nome</th>
                    <th class="text-left">Descrição</th>
                    <th class="text-left">Valor</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index2) in c.items" :key="index2">
                    <td class="text-left">
                      <img :src="item.fotoURL" width="80">
                    </td>
                    <td class="text-left">{{ item.nome }}</td>
                    <td class="text-left">{{ item.desc }}</td>
                    <td class="text-left">{{ item.valor }}</td>
                    <td>
                      <q-btn flat class="float-right" color="negative" icon="far fa-trash-alt" @click="removerItem(index, index2)" />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div> <!-- .row --> 
        </q-card-section>
      </q-card>
      
    </div> <!-- q-pa-md -->
  </q-page>
</template>

<script>
import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue'

export default {
  name: 'PageIndex',

  components: { LottieAnimation },

  mounted () {
    this.persistirDados()
  },

  data () {
    return {
      id: '',
      logo: null,
      itemFoto: null,
      categoria: '',
      categorias: [],
      empresa: {
        nome: '',
        categoria: '',
        logoURL: ''
      },
      rodape: {
        endereco: '',
        whatsapp: '',
        facebook: '',
        instagram: ''
      },
      item: {
        fotoURL: '',
        nome: '',
        desc: '',
        valor: ''
      }
    }
  },

  methods: {
    removerItem(index, index2) {
      this.categorias[index].items.splice(index2, 1)

      this.updateCategorias()
    },
    updateEmpresa() {
      localStorage.setItem('empresa', JSON.stringify(this.empresa))
    },
    updateRodape() {
      localStorage.setItem('rodape', JSON.stringify(this.rodape))
    },
    updateCategorias() {
      localStorage.setItem('categorias', JSON.stringify(this.categorias))
    },
    fileToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    async saveItemFoto () {
      this.$q.loading.show()

      await this.fileToBase64(this.itemFoto)
        .then(async result => {
          let ref = this.$storage.ref().child(this.id + '/' + String(new Date().getTime()))

          let fotoBase64 = this.gerarFotoBase64(result)

          await ref.putString(fotoBase64, 'base64', { contentType: 'image/jpeg' })
            .then((snapshot) => { })

          await ref.getDownloadURL().then(url => {
            this.item.fotoURL = url

            this.$q.notify({ message: 'Foto salva com sucesso!', color: 'positive' })
          })
        })
        .catch(error => {
          this.$q.notify({ message: 'Erro ao salvar a foto!', color: 'negative' })
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },
    async saveLogo () {
      this.$q.loading.show()

      await this.fileToBase64(this.logo)
        .then(async result => {
          let ref = this.$storage.ref().child(this.id + '/logo')

          let fotoBase64 = this.gerarFotoBase64(result)

          await ref.putString(fotoBase64, 'base64', { contentType: 'image/jpeg' })
            .then((snapshot) => { })

          await ref.getDownloadURL().then(url => {
            this.empresa.logoURL = url

            localStorage.setItem('logo', this.logo)
            localStorage.setItem('logoURL', this.empresa.logoURL)

            this.$q.notify({ message: 'Logo salva com sucesso!', color: 'positive' })
          })
        })
        .catch(error => {
          this.$q.notify({ message: 'Erro ao salvar logo!', color: 'negative' })
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },
    addItem (index) {
      this.categorias[index].items.unshift({ ...this.item })

      this.updateCategorias()

      this.limpaItem()

      this.$refs.formulario[0].resetValidation()
    },
    addCategoria () {
      let data = {
        nome: this.categoria,
        items: []
      }

      this.categorias.unshift(data)

      this.updateCategorias()

      this.categoria = ''

      this.$refs.input.resetValidation()
    },
    limpaItem () {
      this.item.fotoURL = ''
      this.itemFoto = null
      this.item.nome = ''
      this.item.desc = ''
      this.item.valor = ''
    },
    gerarFotoBase64 (foto) {
      let fotoBase64 = foto.substr(22)

      if (fotoBase64[0] === ',') {
        fotoBase64 = fotoBase64.substr(1)
      }

      return fotoBase64
    },
    persistirDados () {
      if (localStorage.getItem('id')) {
        this.id = localStorage.getItem('id')
      } else {
        this.id = String(new Date().getTime())
        localStorage.setItem('id', this.id)
      }

      if (localStorage.getItem('categorias')) {
        this.categorias = JSON.parse(localStorage.getItem('categorias'))
      }

      if (localStorage.getItem('empresa')) {
        this.empresa = JSON.parse(localStorage.getItem('empresa'))
      }

      if (localStorage.getItem('rodape')) {
        this.rodape = JSON.parse(localStorage.getItem('rodape'))
      }

      if (localStorage.getItem('logoURL')) {
        this.empresa.logoURL = localStorage.getItem('logoURL')
      }
    }
  }
}
</script>
