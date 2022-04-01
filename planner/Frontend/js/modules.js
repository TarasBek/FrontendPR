import { cardDeck } from "./main.js";

const EDIT_BUTTON_PREFIX = "edit-";
const DELETE_BUTTON_PREFIX = "delete-";

const poolNameInput = document.getElementById("name_input");
const volumeOfWaterInput = document.getElementById("volumeOfWater_input");
const maxAmountInput = document.getElementById("maxAmount_input");

const cardTemplate = ({ id, poolName, volumeOfWater, maxAmount }) => `
<div id="${id}" class="card bg-dark text-light">
<div class="card-body">
<h5 class="card-title">${poolName}</h5>
<p class="card-text">
Time needed: ${volumeOfWater}<br>
deadline: ${maxAmount}
</p>
</div>
<div class="card-footer">
<small class="text-muted">
<i id="${EDIT_BUTTON_PREFIX}${id}" class="fas fa-edit fa-lg btnedit"></i>
<i id="${DELETE_BUTTON_PREFIX}${id}" class="fas fa-trash-alt fa-lg btndelete"></i>
</small>
</div>
</div>
`;

const addItemToPage = ({ id, name, volume_of_water, max_amount },
    onEdit,
    onDelete,
) => {
    cardDeck.insertAdjacentHTML(
        "afterbegin",
        cardTemplate({
            id,
            poolName: name,
            volumeOfWater: volume_of_water,
            maxAmount: max_amount,
        })
    );

    const editButton = document.getElementById(`${EDIT_BUTTON_PREFIX}${id}`);
    editButton.addEventListener("click", onEdit);

    const deleteButton = document.getElementById(`${DELETE_BUTTON_PREFIX}${id}`);
    deleteButton.addEventListener("click", onDelete);
};

const renderItemsDOM = (dataArray, onEdit, onDelete) => {
    cardDeck.innerHTML = "";
    for (const item of dataArray) {
        addItemToPage(item, onEdit, onDelete);
    }
};

const calculateTotal = (dataArray, key) => {
    const total = dataArray.reduce((acc, item) => acc + key(item), 0);
    return total;
};
//key  повертає масив елемента item

const clearInputs = () => {
    poolNameInput.value = "";
    volumeOfWaterInput.value = "";
    maxAmountInput.value = "";
};

const fillUpdateValues = ({ name, volume_of_water, max_amount }) => {
    poolNameInput.value = name;
    volumeOfWaterInput.value = volume_of_water;
    maxAmountInput.value = max_amount;
};

const getInputValues = () => {
    return {
        name: poolNameInput.value,
        volume_of_water: volumeOfWaterInput.value,
        max_amount: maxAmountInput.value,
    };
};


export {
    addItemToPage,
    renderItemsDOM,
    calculateTotal,
    clearInputs,
    getInputValues,
    EDIT_BUTTON_PREFIX,
    DELETE_BUTTON_PREFIX,
    fillUpdateValues,
};