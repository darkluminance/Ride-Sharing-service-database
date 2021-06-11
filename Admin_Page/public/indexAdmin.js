// var myVar = document.getElementById('haga');

// myVar.addEventListener("click",function(){
//     alert("hi");
// });
{
    /**
    * Populates a data table with some data
    * @param {HTMLDivElement} root 
    */
    async function updateTable(root){
    const table=root.querySelector(".table-ref-data");
    const response=await fetch("http://localhost:5000/Userdata");
    const userdata=await response.json();
    console.log(userdata);

        //clear data
        table.querySelector("thead tr").innerHTML = "";
        table.querySelector("tbody").innerHTML = "";

        //populate headers
        for(const header of response.headers){
            table.querySelector("thead tr").insertAdjacentElement("afterbegin" , `<th>${ header }</th>`);
        }
    }
    for(const root of document.querySelectorAll(".table-ref[data-url]")){
        const table =document.createElement("table");

        table.classList.add("table-ref-data");

        table.innerHTML=`
            <thead>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <td>loading</td>
                <tr>    
            </tbody>
        `;

        root.append(table);

        updateTable(root);
    }
}
