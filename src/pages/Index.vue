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
              <q-btn @click="removerCategoria(index)" flat class="float-right" label="Excluir categoria" color="negative" icon="far fa-trash-alt" />
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

      <q-btn label="Gerar código" color="purple" @click="pronto" /> &nbsp;
      <q-btn label="Fazer Backup" color="negative" @click="backup" /> &nbsp;
      <q-btn label="Importar" color="positive" @click="$refs.importar.show()" /> &nbsp;
      <q-btn label="Novo" class="float-right" color="black" @click="novo" /> &nbsp;
      
    </div> <!-- q-pa-md -->

    <q-dialog ref="codigo">
      <q-card>
        <q-card-section>
          <div class="text-h6">Tudo pronto, só copiar o código ;)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="codigo"
            readonly
            filled
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Copiar código" color="primary" @click="copyCodigo" />
          <q-btn flat label="fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog ref="importar">
      <q-card>
        <q-card-section>
          <div class="text-h6">Atenção!</div>
          <p>Antes de importar não esqueça de realizar o backup do estado atual! <br> (caso tenha alterações)</p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-file color="purple-12" v-model="fileImportar" label="Selecione o arquivo .json">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Importar" color="primary" @click="importar" />
          <q-btn flat label="fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue'
import { copyToClipboard } from 'quasar'
const minifier = require('string-minify')

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
      },
      codigo: '',
      fileImportar: null,
      css: `
        * {box-sizing: border-box; font-family: sans-serif; margin: 0; padding: 0;}
        a {color: #3498db; display: inline-block;}
        body, html {height: 100%;}
        img {max-width: 100%;}
        p {line-height: 150%;}


        body {
          background-image: url(https://firebasestorage.googleapis.com/v0/b/gerador-cardapio.appspot.com/o/site%20-%20n%C3%A3o%20excluir%2Fbackground.jpg?alt=media&token=9f055f31-2cda-425c-8152-4b244085079e);
        }

        .container {
          display: block;
          margin: 0 auto;
          max-width: 1080px;
        }

        .cabecalho {
          max-height: 255px;
          max-width: 1080px;
          position: relative;
        }

        .cabecalho-logo {
          display: block;
          height: 88.627450980392%; /* 226px */
          left: 9.444%; /* 100px */
          position: absolute;
          top: 0px;
          width: 19.956%; /* 215px */
        }
        .cabecalho-logo > img {
          height: 100%;
          width: 100%;
        }

        .cabecalho-textos {
          align-items: center;
          display: flex;
          height: 62.745098039216%; /* 160px */
          justify-content: flex-end;
          position: absolute;
          right: 9.2592592592593%; /*  100px */
          text-align: right;
          top: 33.333333333333%; /* 85px */
          width: 55.555555555556%; /* 600px */
        }

        .categoria {
          margin-left: 9.2592592592593%; /* 100px */
          margin-bottom: 0px;
          max-width: 83%; /* 896.4px */
        }

        .categoria-titulo {
          align-items: center;
          display: flex;
          flex-direction: row;
          margin-bottom: 30px;
          width: 100%;
        }

        .categoria-titulo > h2 {
          color: #e24452;
          flex: 1;
          min-width: 300px;
        }

        .categoria-titulo > img {
          height: 20px;
          flex: 1;
          width: calc(100% - 300px);
        }

        .categoria-item {
          display: flex;
          margin-bottom: 15px;
          position: relative;
        }

        .categoria-item-titulo {
          align-items: center;
          color: #fff;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .categoria-item-titulo > h1 {
        }

        .categoria-item .preco {
          color: #e24452;
          font-weight: bold;
          position: absolute;
          right: 80px;
          top: 23px;
        }

        .rodape {
          margin-top: 30px;
          position: relative;
        }

        .rodape-textos {
          position: absolute;
          top: 50px;
          left: 200px;
        }

        .rodape-textos > p {
          color: #fff;
          margin-bottom: 18px;
        }
        `
    }
  },

  methods: {
    novo () {
      this.$q.dialog({
        title: 'Atenção!',
        message: 'Não esqueça de fazer BACKUP antes de criar um novo cardápio.',
        cancel: true,
        ok: { label: 'Criar novo cardápio', color: 'black' },
        persistent: false
      }).onOk(() => {
        localStorage.clear()
        this.$router.push({ name: 'splash' })
      })
    },
    importar () {
      var file_to_read = this.fileImportar
      var fileread = new FileReader()
      fileread.onload = e => {
        var content = e.target.result
        // console.log(content)
        var intern = JSON.parse(content) // Array of Objects.

        localStorage.clear()

        localStorage.setItem('categorias', JSON.stringify(intern.categorias))
        localStorage.setItem('empresa', JSON.stringify(intern.empresa))
        localStorage.setItem('id', intern.id)
        localStorage.setItem('logoURL', intern.logoURL)
        localStorage.setItem('rodape', JSON.stringify(intern.rodape))

        this.$router.push({ name: 'splash' })
      }
      fileread.readAsText(file_to_read)
    },
    backup () {
      const filename = `${this.empresa.nome}-${this.id}.json`
      const jsonStr = JSON.stringify({ logoURL: this.empresa.logoURL, id: this.id, categorias: this.categorias, rodape: this.rodape, empresa: this.empresa })

      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(jsonStr))
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click();

      document.body.removeChild(element);
    },
    copyCodigo () {
      copyToClipboard(this.codigo)
        .then(() => {
          this.$q.notify({ message: 'Copiado!', color: 'positive' })
        })
        .catch(() => {
          this.$q.notify('Erro ao copiar! Copie manualmente!')
        })
    },
    pronto () {
      const codigo = `
        <!DOCTYPE html>
        <html lang="pt-br">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=860, initial-scale=0.4, user-scalable=no">
            <title>Cardápio Online ${this.empresa.nome}</title>
            <meta property="og:title" content="Cardápio Online ${this.empresa.nome}">
            <meta property="og:description" content="Entre aqui e veja nosso cardápio online.">
            <meta property="og:image" content="${this.empresa.logoURL}"/>
            <style>
              ${this.css}
            </style>
          </head>
          <body>
              <div class="container">

                <header class="cabecalho">
                  <img src="https://firebasestorage.googleapis.com/v0/b/gerador-cardapio.appspot.com/o/site%20-%20n%C3%A3o%20excluir%2Fcabecalho2.jpg?alt=media&token=ae687136-93cd-46ba-8234-01c1ba5cacde">

                  <div class="cabecalho-logo">
                    <img src="${this.empresa.logoURL}">
                  </div>

                  <div class="cabecalho-textos">
                    <div>
                      <h1 style="color: #e24452;">${this.empresa.nome}</h1>
                      <h2 style="color: #fff">${this.empresa.categoria}</h2>
                    </div>
                  </div>
                </header> <!-- cabecalho-->

                ${this.gerarCategoriasHTML()}

                <footer class="rodape">
                  <img src="https://firebasestorage.googleapis.com/v0/b/gerador-cardapio.appspot.com/o/site%20-%20n%C3%A3o%20excluir%2Flinha.png?alt=media&token=37ded6f6-a7ae-4331-b720-9c75c067ad78" style="margin: 0 auto -50px auto; display: block;">
                  <img src="https://firebasestorage.googleapis.com/v0/b/gerador-cardapio.appspot.com/o/site%20-%20n%C3%A3o%20excluir%2Frodape-quina.png?alt=media&token=44c6dbb6-27a2-43f3-a4c3-48149b745f4d">
                  <div class="rodape-textos">
                    <p>${this.rodape.endereco}</p>
                    <p>${this.rodape.whatsapp}</p>
                    <p>${this.rodape.facebook}</p>
                    <p>${this.rodape.instagram}</p>
                  </div>
                </footer>

            </div> <!-- container -->
          </body>
        </html>
        `

        this.codigo = minifier(codigo)
        this.$refs.codigo.show()
    },
    gerarCategoriasHTML () {
      let data = ''

      for (let i = 0; i < this.categorias.length; i++) {
        data += `<section class="categoria">
          <div class="categoria-titulo">
            <h2>${this.categorias[i].nome}</h2>
            <img src="https://firebasestorage.googleapis.com/v0/b/gerador-cardapio.appspot.com/o/site%20-%20n%C3%A3o%20excluir%2Flinha.png?alt=media&token=37ded6f6-a7ae-4331-b720-9c75c067ad78">
          </div>
          ${this.gerarCategoriasItemsHTML(i)}
        </section>`
      }

      return data
    },
    gerarCategoriasItemsHTML (index) {
      let data = ''

      for (let i = 0; i < this.categorias[index].items.length; i++) {
        data += `<article class="categoria-item">
          <img src="${this.categorias[index].items[i].fotoURL}" width="80" height="80">
          <span class="preco">R$ ${this.categorias[index].items[i].valor}</span>
          <div style="padding-left: 10px; width: 100%">
            <div class="categoria-item-titulo">
              <h1>${this.categorias[index].items[i].nome}</h1>
              <img src="https://firebasestorage.googleapis.com/v0/b/gerador-cardapio.appspot.com/o/site%20-%20n%C3%A3o%20excluir%2Fcaixa-preco.png?alt=media&token=9ecc7e36-03d2-4efd-8eaa-a38d24202865">
            </div>

            <p style="width: 70%; margin-top: -15px; color: #fff; font-size: 14px;">${this.categorias[index].items[i].desc}</p>
          </div>
        </article>`
      }

      return data
    },
    removerCategoria (index) {
      this.$q.dialog({
        title: 'Atenção!',
        message: `Realmente deseja excluir a CATEGORIA ${this.categorias[index].nome.toUpperCase()}? `,
        cancel: { label: 'Não' },
        persistent: false
      }).onOk(() => {
        this.categorias.splice(index, 1)
      })
    },
    removerItem(index, index2) {
      this.categorias[index].items.splice(index2, 1)

      this.updateCategorias()

      this.$q.notify({ message: 'Item excluido!', color: 'positive' })
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
      this.categorias[index].items.push({ ...this.item })

      this.updateCategorias()

      this.limpaItem()

      this.$refs.formulario[0].resetValidation()
    },
    addCategoria () {
      let data = {
        nome: this.categoria,
        items: []
      }

      this.categorias.push(data)

      this.updateCategorias()

      this.categoria = ''

      this.$refs.input.resetValidation()

      this.$q.notify({ message: 'Categoria Adicionada!', color: 'positive' })
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
