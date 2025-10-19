export class Profit{
    constructor() {
        setTimeout(() => {
            this.init();
        }, 100);
    }
    init(){
        this.setUpEditButton();
        this.actionDelete()
    }
    setUpEditButton(){
        let editButton = document.querySelectorAll('.edit-btn');
        editButton.forEach(button=>{
            button.addEventListener('click',()=>{
                window.location.href='edit-profit';
            })
        })
    }
    // actionDelete(){
    //     let acceptDelete = document.querySelectorAll('.confirmDelete');
    //     let cardToDelete = document.querySelector('.card');
    //     acceptDelete.addEventListener('click', function (){
    //         if(cardToDelete){
    //             cardToDelete.remove();
    //         }
    //         })
    // }
}