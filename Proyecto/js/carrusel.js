class Carrusel{

    constructor(){
        this.createCarrusel();
    }

    createCarrusel(){
        const slides = document.querySelectorAll("article img");

        const nextSlide = document.querySelector("button:nth-of-type(1)");

        let curSlide = 0;
        const maxSlide = slides.length - 1;

        nextSlide.addEventListener("click", function () {
            if (curSlide === maxSlide) {
                curSlide = 0; 
            } else {
                curSlide++;
            }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
                $(slide).css("transform", "translateX(" + trans + "%)");
            });
        });

        const prevSlide = document.querySelector("button:nth-of-type(2)")

        prevSlide.addEventListener("click", function () {
            if (curSlide === 0) {
                curSlide = maxSlide;  
            } else {
                curSlide--;
            }

            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide)
                $(slide).css("transform", "translateX(" + trans + "%)")
            });
        });
    } 

}