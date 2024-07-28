const alertContainer = document.querySelector(".alert-container")
document.querySelector('form').addEventListener('submit',async function(event) {
    event.preventDefault();
    const productName=document.querySelector("#product_name").value
    const categoryId=document.querySelector("#category_id").value
    const supplierId=document.querySelector("#supplier_id").value
    const quantity=document.querySelector("#quantity").value
    const price=document.querySelector("#price").value
    const requestJson=JSON.stringify({
        "product_name":productName,
        "category_id":categoryId,
        "supplier_id":supplierId,
        "quantity": quantity,
        "price":price
    })
    console.log(requestJson)
    const response = await fetch("http://localhost:3000/api",{
        method: "POST",
        headers:{
            "content-type":"application/json"
        },
        body:requestJson

    })
    const data=await response.json()
    console.log(data)
    alertContainer.innerHTML=data["message"]
    alertContainer.classList.add("alert-active")
    setTimeout(()=>{
        alertContainer.classList.remove("alert-active")
    },3000)
});