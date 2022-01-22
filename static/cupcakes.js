const BASE_URL = "http://127.0.0.1:5000/api";

function generateCupcakeHTMl(cupcake){
    let li = document.createElement('li')
    li.setAttribute('data-cupcake-id',`${cupcake.id}`)
    let div = document.createElement('div')
    div.innerText= `${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating} `
    let btn = document.createElement('button')
    btn.innerText = "X"
    btn.classList.add('delete-button')
    div.append(btn)
    let img = document.createElement('img')
    img.setAttribute('src', `${cupcake.image}`)
    li.append(div)
    li.append(img)
    return li
}

async function showCupcakeList(){
    const res = await axios.get(`${BASE_URL}/cupcakes`)
    for(let cupcakeDate of res.data.cupcakes){
        // let li = document.createElement('li')
        // li.innerHTML=cupcakeDate.flavor
        let newcupcake = generateCupcakeHTMl(cupcakeDate)
        let CupcakesList = document.querySelector('#cupcakes-list')
        CupcakesList.appendChild(newcupcake)
    }
    
}

let form = document.querySelector('#new-cupcake-form')
form.addEventListener('submit', async function(evt){
    evt.preventDefault()

    let flavor = document.querySelector('#form-flavor').value
    let rating = document.querySelector('#form-rating').value
    let size = document.querySelector('#form-size').value
    let image = document.querySelector('#form-image').value

    const res = await axios.post(`${BASE_URL}/cupcakes`, {
        flavor,
        rating,
        size,
        image
        
    });

    let newcupcake = generateCupcakeHTMl(res.data.cupcake)
    let CupcakesList = document.querySelector('#cupcakes-list')
    CupcakesList.appendChild(newcupcake)
    form.reset();
})

let CupcakesList = document.querySelector('#cupcakes-list')
CupcakesList.addEventListener('click', async function(evt)
    {
        evt.preventDefault()
    
        if(evt.target.className === "delete-button"){
        let cupcake = evt.target.parentElement.parentElement;
        let cupcakeId = cupcake.getAttribute('data-cupcake-id')
        await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`)
        cupcake.remove()

        }
        
    }
)


showCupcakeList()

