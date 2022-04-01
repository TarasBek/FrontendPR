import {
    getAllPools,
    searchPools,
    postPools,
    editPools,
    getPoolsById,
    deletePools,
} from "./api.js";
import {
    renderItemsDOM,
    calculateTotal,
    clearInputs,
    getInputValues,
    EDIT_BUTTON_PREFIX,
    fillUpdateValues,
    DELETE_BUTTON_PREFIX,
} from "./modules.js";

const cardDeck = document.getElementById("card-deck");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const sortCheckbox = document.getElementById("sort");
const countBtn = document.getElementById("count");
const countResults = document.getElementById("count_results");
const countTotal = document.getElementById("count_total");
const createSubmit = document.getElementById("submit_button");
const updateSubmit = document.getElementById("submit_update");
const formFields = document.getElementsByClassName("create-input");

let pools = [];



const onEdit = async(element) => {
    const id = element.target.id.replace(EDIT_BUTTON_PREFIX, "");
    let { name, volume_of_water, max_amount } = await getPoolsById(id);
    fillUpdateValues({
        name, volume_of_water, max_amount
    });

    updateSubmit.addEventListener("click", (event) => {
        if (includesEmptyFields()) {
            return;
        }
        event.preventDefault();
        const newPool = getInputValues();
        clearInputs();
        editPools(id, newPool).then(refetchAllPools);
    })
};

const onDelete = (element) => {
    const id = element.target.id.replace(DELETE_BUTTON_PREFIX, "");
    deletePools(id).then(refetchAllPools);
}

const refetchAllPools = async() => {
    const allPools = await getAllPools();
    pools = allPools;
    renderItemsDOM(pools, onEdit, onDelete);
};

const includesEmptyFields = () => {
    let countOfEmptyFields = Array.from(formFields).filter(
        (x) => x.value == ""
    ).length;
    return countOfEmptyFields != 0;
};

createSubmit.addEventListener("click", (event) => {
    if (includesEmptyFields()) {
        return;
    }
    event.preventDefault();
    const newPool = getInputValues();
    clearInputs();
    postPools(newPool).then(refetchAllPools);
});

searchButton.addEventListener("click", async(event) => {
    event.preventDefault();
    const foundPools = await searchPools(searchInput.value);
    renderItemsDOM(foundPools, onEdit, onDelete);
});

sortCheckbox.addEventListener("change", () => {
    let sortedPools = Array.from(pools);
    if (sortCheckbox.checked) {
        sortedPools.sort(
            (first, second) => first.max_amount - second.max_amount
        );
    }
    renderItemsDOM(sortedPools, onEdit, onDelete);
});

countBtn.addEventListener("click", () => {
    countResults.classList.remove("hidden");
    const totalPrice = calculateTotal(pools, (pool) => pool.volume_of_water);
    countTotal.innerHTML = totalPrice;
});

refetchAllPools();

export default pools;
export { cardDeck };