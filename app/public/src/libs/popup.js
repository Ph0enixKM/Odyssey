(function(){
    // Instantiate new StyleSheet
    document.head.innerHTML += `
      <style>
        .popup-lib {
          min-width: 250px;
          max-width: 500px;
          word-wrap: break-word;
          padding: 10px;
          color: white;
          background-color: rgba(150, 80, 0, 0.4);
          user-select: none;
          cursor: default;
          position: absolute;
          left: 99%;
          top: 99%;
          font-family: Lato, Verdana, sans-serif;
          transition: 300ms;
          opacity: 0;
          list-style: none;
        }
        .popup-lib:first-of-type {
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
        }
        .popup-lib:last-of-type {
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }
        .base-lib {
          width: 0;
          height: 0;
          display: inline-block;
          padding: 0;
          margin: 0;
        }
      </style>
    `

    class PopUp {
      /**
       * @param {x} string
       * @param {y} string
      */
      constructor() {
        this.existing = []

        this.base = document.createElement('ul')
        this.base.className = 'base-lib'
        document.body.appendChild(this.base)
      }

      summon(text) {
        let instance = document.createElement('li')
        instance.className = 'popup-lib'
        setTimeout(()=>{
          instance.style.opacity = 1
        },300)
        instance.style.transform = 'translate(-100%,-'
          +((this.existing.length+1)*100)
          +'%)'
        instance.innerHTML = text
        this.base.appendChild(instance)
        this.existing[this.existing.length] = instance
        setTimeout(()=>{
          instance.style.opacity = 0
          setTimeout(()=>{
            instance.remove()
            this.existing = this.existing.slice(1,this.existing.length)
            for (let i = 0; i < this.existing.length; i++) {
              this.existing[i].style.transform = 'translate(-100%,-'
                +((i+1)*100)
                +'%)'
            }
          },300)
        },5000)
      }
    }

    window.PopUp = new PopUp()

})()
