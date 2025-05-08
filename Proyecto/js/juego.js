class Juego {

    constructor(){
        this.questions = {};
        this.createElements();

        this.loadQuestons();
        this.renderQuestions();
        this.button.addEventListener("click", () => this.checkAnswers());
    }

    createElements(){
        const main = document.createElement("main");
        document.body.appendChild(main);
    
        this.section = document.createElement("section");
        this.title = document.createElement("h2");
        this.title.textContent = "Test"
        this.result = document.createElement("p");
        this.button = document.createElement("button"); 
        this.button.type = "button";                    
        this.button.textContent = "Enviar";  
    
        main.appendChild(this.section);
        this.section.appendChild(this.title);
        main.appendChild(this.result);
        main.appendChild(this.button);
    }
    

    renderQuestions() {
        let counter = 1;
        for (const key in this.questions) {
            const question = this.questions[key];
            const options = [question.correct, ...question.incorrect].sort(() => Math.random() - 0.5);
        
            const article = document.createElement("article");
            const encabezado = document.createElement("h3");
            encabezado.textContent = "Pregunta " + counter;
            article.appendChild(encabezado);

            const titulo = document.createElement("p");
            titulo.textContent = question.text;
            article.appendChild(titulo);
        
            const fieldset = document.createElement("fieldset");
        
            options.forEach(option => {
                const label = document.createElement("label");
                const input = document.createElement("input");
                input.type = "radio";
                input.name = key;
                input.value = option;
                label.appendChild(input);
                label.append(" " + option);
                fieldset.appendChild(label);
            });
        
            article.appendChild(fieldset);
            this.section.appendChild(article);
            counter++;
        }
    }

    checkAnswers() {
        let score = 0;
        let allAnswered = true;

        for (const key in this.questions) {
            const selectedOption = document.querySelector(`input[name="${key}"]:checked`);
            
            if (!selectedOption) {
                allAnswered = false; 
            } else if (selectedOption.value === this.questions[key].correct) {
                score++;
            }
        }
        
        if (!allAnswered) {
            this.result.textContent = "Debes responder todas las preguntas antes de enviar.";
            return;
        }

        this.result.textContent = `Tu puntuación es: ${score} sobre 10.`;
    }
    
    loadQuestons(){
        this.questions = {
            question1: {
                text: "¿Cuál de los siguientes platos es típico de Noreña?",
                correct: "Callos a la asturiana",
                incorrect: ["Paella valenciana", "Pulpo a la gallega", "Cocido montañés", "Gazpacho andaluz"]
            },
            question2: {
                text: "¿Qué embutido es característico de Noreña?",
                correct: "Sabadiego",
                incorrect: ["Chistorra", "Butifarra", "Fuet", "Salchichón ibérico"]
            },
            question3: {
                text: "¿Qué es el sabadiego?",
                correct: "Un embutido mezcla de chorizo y morcilla, con sabor ahumado",
                incorrect: [
                    "Un dulce relleno de crema",
                    "Un tipo de queso curado",
                    "Una bebida fermentada",
                    "Una empanada de carne"
                ]
            },
            question4: {
                text: "¿Qué fiesta celebra el sabadiego?",
                correct: "Fiesta del Sabadiego",
                incorrect: [
                    "Fiesta del Pulpo",
                    "Semana del Queso",
                    "Día del Jamón",
                    "Festival de la Castaña"
                ]
            },
            question5: {
                text: "¿Qué se ofrece durante las Jornadas de la Chacinera?",
                correct: "Menús especiales centrados en embutidos",
                incorrect: [
                    "Degustaciones de sidra",
                    "Platos de marisco",
                    "Talleres de cocina internacional",
                    "Concursos de repostería"
                ]
            },
            question6: {
                text: "¿Cuál de los siguientes postres es tradicional en Noreña?",
                correct: "Arroz con leche",
                incorrect: ["Tarta Sacher", "Flan de coco", "Brownie", "Tarta de Santiago"]
            },
            question7: {
                text: "¿Qué incluye el mercado tradicional de San Isidro?",
                correct: "Desfile de ganado y comidas populares",
                incorrect: [
                    "Romerías marítimas",
                    "Catas de vino",
                    "Subastas de marisco",
                    "Ferias del libro"
                ]
            },
            question8: {
                text: "¿Qué plato se suele servir con huevos fritos según la tradición local?",
                correct: "Picadillo",
                incorrect: [
                    "Bacalao al pil pil",
                    "Pimientos rellenos",
                    "Callos con garbanzos",
                    "Pisto manchego"
                ]
            },
            question9: {
                text: "¿Cuándo se celebran las Fiestas Patronales en Noreña?",
                correct: "En agosto",
                incorrect: ["En abril", "En diciembre", "En enero", "En marzo"]
            },
            question10: {
                text: "¿Qué término describe un evento de embutidos en Noreña?",
                correct: "Chacinera",
                incorrect: ["Mariscada", "Pulpería", "Quesería", "Cervecería"]
            }
        };        
    }
}