
    
    

    function populateUFs(){
        const ufSelect = document.querySelector("select[name=uf]");


        //usando o método fetch ele nos faz uma promessa de ir buscar os dados na API endereçada
        //e se os trouxer de volta com o .then cria uma função anônima transformando a resposta em JSON
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then( res =>  res.json())
        .then( states => {
            
            for (const state of states){
            // += é a mesma coisa que x = x +.....
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
        });
    }

    populateUFs();


    function getCities(event){
        const citySelect = document.querySelector("select[name=city]");
        const stateInput = document.querySelector("input[name=state]");
        
        // event.target traz o evento e o local onde ele foi executado, no caso o Select,
        //este sendo referenciado no target e o .value pega o valor dele
        const ufValue = event.target.value;

        const indexOfSelectedState = event.target.selectedIndex;
        stateInput.value = event.target.options[indexOfSelectedState].text;

        const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
        
        citySelect.innerHTML = "<option value=''>Selecione a cidade</option>";
        citySelect.disable = true;
        
        fetch(url)
        .then( res =>  res.json())
        .then( cities => {
            
            for (const city of cities){
                
            // += é a mesma coisa que x = x +.....
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disable = false;
        });
   
    }







    document.querySelector("select[name=uf]")
    .addEventListener("change", getCities);
    // acima referenciando a função getCities não usamos agora o " () ", pois se não executaria
    //imediatamente a função, e queremos apenas registra-la ali.

    // Itens de coleta
    // Pegar todos os li's

    const itemsToCollect = document.querySelectorAll(".items-grid li")

    for (const item of itemsToCollect) {
        item.addEventListener("click", handleSelectedItem); // call back function aqui
    }

    const collectedItems = document.querySelector("input[name=items]");

    let selectedItems = [];



    function handleSelectedItem(event){
        
        const itemLi = event.target; 

        // adicionar ou remover uma class com JS
        //toggle faz a função de adcionar ou remover
        itemLi.classList.toggle("selected")

        // pega os itens selecionando-os pelos id's que foram setados antes
        const itemId = itemLi.dataset.id;

        console.log('ITEM ID: ', itemId);


        // verificar se existem itens selecionados, se sim
        // pegar os itens selecionados
        
        const alreadySelected = selectedItems.findIndex( item => {
             const itemFound = item == itemId; // isso será tre ou false
             return itemFound; 
        } ); 

        // método bom para testar oque uma varável está guardando ou recebendo
        // console.log(alreadySelected);

        // se já estiver selecionado, tirar da seleção

        if (alreadySelected >= 0){
            // tirar da seleção
            const filteredItems = selectedItems.filter( item => {
                const itemIsDifferent = item != itemId //false
                return itemIsDifferent;
            }) 

            selectedItems = filteredItems;
            
        } else { // se não estiver selecionado, adicionar à seleção
            selectedItems.push(itemId);
        }
        

        console.log('selectedItems: ', selectedItems);

        // atualizar o campo escondido com os itens selelcionados

        collectedItems.value = selectedItems;

        
    }

