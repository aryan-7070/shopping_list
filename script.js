const itemForm=document.getElementById('item-form');
const itemInput=document.getElementById('item-input');
const itemList=document.getElementById('item-list');
const clearBtn=document.getElementById('clear');
const items=itemList.querySelectorAll('li');
const itemFilter=document.getElementById('filter');
const formBtn =itemForm.querySelector('button');
let isEditMode=false;

function displayItems(){
    const itemsFromStorage=getItemsFromStorage();
    itemsFromStorage.forEach((item)=>addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e){
    e.preventDefault();
const newItem=itemInput.value;
   //validate input
   if(newItem ===''){
    alert('No item is added plzz add them');
    return;
   }

//check the edit mode
if(isEditMode){
    const itemToEdit=itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode=false;
}
else{
    if(checkIfItemExists(newItem)){
        alert('That item already exists !');
        return ;
    }
}

//create item dom element
  addItemToDOM(newItem);

  //create item to storage
  addItemToStorage(newItem);



  checkUI();
 
itemInput.value='';
}

function addItemToDOM(item){
//create a list item-------
const li= document.createElement('li');
li.appendChild(document.createTextNode(item));

const button=createButton('remove-item btn-link text-red');
li.appendChild(button);
//Add item to dom
itemList.appendChild(li);
}




function createButton(classes){
    const button =document.createElement('button');
    button.className =classes;
    const icon=createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return  button;
}

function createIcon(classes){
    const icon =document.createElement('i');
    icon.className =classes;
    return  icon;
}

function addItemToStorage(item){
    const itemsFromStorage= getItemsFromStorage();

    //Add new item to array.
    itemsFromStorage.push(item);

    //Convert to JSon string and set to the local storage.
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
 
    let itemsFromStorage;
    if(localStorage.getItem('items')===null){
        itemsFromStorage=[];
     } else{
       itemsFromStorage=JSON.parse(localStorage.getItem('items'));
     }
  return itemsFromStorage;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item'))
    {
        removeItem(e.target.parentElement.parentElement);
    }
    else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage =getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode=true;

    itemList.querySelectorAll('li').forEach((i)=>i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML='<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor ='#228B22';
    itemInput.value =item.textContent;
}

function removeItem(item){
   
    if (confirm('Are u sure?')){
        //remove item from dom
      item.remove();

      //remove item from storage.
      removeItemFromStorage(item.textContent);
            
             checkUI();
     }
    }
    
    function removeItemFromStorage(item){
        let itemsFromStorage=getItemsFromStorage();

        //filter out item to be removed.
        itemsFromStorage= itemsFromStorage.filter((i)=> i !==item);

        //re-set to local storage
        localStorage.setItem('items',JSON.stringify(itemsFromStorage));
    }

function clearItem(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    //clear from local storage.
    localStorage.removeItem('items'); 

    checkUI();
}
function checkUI() {
    itemInput.value='';

    const items= itemList.querySelectorAll('li');
    if(items.length===0){
        clearBtn.style.display='none';
        itemFilter.style.display='none';
    }
    else{
        clearBtn.style.display='block';
       itemFilter.style.display='block';
    }
    formBtn.innerHTML='<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor ='#333';
    isEditMode=false;
}
function filterItems(e){
    const items= itemList.querySelectorAll('li');
    const text=e.target.value.toLowerCase();
    
    items.forEach((item)=>{
      const itemName =item.firstChild.textContent.toLowerCase();

      if(itemName.indexOf(text)!=-1){
        item.style.display='flex';
      }
      else{
        item.style.display='none';
      }
    });


}
//Initalize App
function init(){
//event listeners---------
itemForm.addEventListener('submit',onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click',clearItem);
itemFilter.addEventListener('input',filterItems);
document.addEventListener('DOMContentLoaded',displayItems);


checkUI();
}
init();
