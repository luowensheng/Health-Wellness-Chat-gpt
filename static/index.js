const SCREEN_ELEMENT = document.querySelector("#screen");
const TEXT = document.querySelector("#text-input")

let isWaitingForReply = false

document.addEventListener("DOMContentLoaded", ()=>{
    TEXT.value = ""
    TEXT.addEventListener("keyup", (e)=>{
       
        if (e.key=="Enter") onPromptSubmit(e);
    })
    document.querySelector("#first-prompt-btn")
            .addEventListener("click", onPromptSubmit)
})


class Message {
    #textElement;
    #id;

    constructor(text, isUser){

        const type = (isUser)?"user": "ai";
        const div = document.createElement('div')
        div.setAttribute("class", `content ${type}`)
        const p = document.createElement('p')
        p.textContent = text
        div.appendChild(p)
        SCREEN_ELEMENT.appendChild(div)

        this.#textElement = p
        this.#id = null
    }

    write(text){
        this.#textElement.textContent = text
    }

    /**
     * @param {string} text 
     * @param {number} interval 
     */
    async writeSlowly(text, interval){
        
        let index = 0;
        this.#id = setInterval(()=>{
            
            this.write(text.substring(0, index+1))
            if (index++ >=text.length){
                clearInterval(this.#id)
            }
        }, interval)
    }

    clearInterval(){
        this.clearInterval(clearInterval(this.#id))
    }
}


/**
* @param {Event} e
*/
async function onPromptSubmit(e) {
    if (isWaitingForReply) return;
    isWaitingForReply = true;
    
    try {

        const prompt = (TEXT.value|| "").trim()
        TEXT.value = "";
        if (prompt == "") return;
        
       
        new Message(prompt, true)
        const aiMessage = new Message("", false)
        aiMessage.write("...")


        const response = await fetch("/api/v1/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"prompt": prompt}),
            credentials: "same-origin"
        })
        
        
        const json = await response.json();
        console.log({json})
    
        if (json.success){
            aiMessage.writeSlowly(json.content, 10)
        }
        else {
            aiMessage.writeSlowly("Sorry, I couldn't understand you request. Can you rephrase that?", 10)
        }

    } catch (error) {
        console.error(e)
    }

    isWaitingForReply = false;

}
