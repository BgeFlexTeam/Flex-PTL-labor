async function packSNTap() {
    let selectedSerialNum = document.getElementById("packSerialNumber").value
    console.log(selectedSerialNum)
    if (selectedSerialNum != null & selectedSerialNum.length > 0) {
        console.log(selectedSerialNum)
        $.ajax({
            method: "POST",
            url: "/Product/getProductBySN",
            dataType: "json",
            data: { serialnum: selectedSerialNum }
        }).done(function (response) {
            console.log(response)
            if (response.stationID === 1) {
                swal.fire({
                    title: "Go to the Kitting station!",
                    type: 'warning',
                    confirmButtonText: 'OK'
                });
                //alert("Go to the Kitting station!")
                document.getElementById("packlabel").innerText = "" 
            } else if (response.stationID === 2) {
                swal.fire({
                    title: "Go to the Assembly station!",
                    type: 'warning',
                    confirmButtonText: 'OK'
                });
                //alert("Go to the Assembly station!")
                document.getElementById("packlabel").innerText = "" 
            }
            if (response.stationID === 3) {
                console.log(response)
                packSN(response);
            } 
            else if (response.stationID === 4) {
                swal.fire({
                    title: "Pack is complete yet! ( SerialNumber: " + response.serialNumber + ")",
                    type: 'warning',
                    confirmButtonText: 'OK'
                });
                document.getElementById("packSerialNumber").value = null;
                //document.getElementById("packlabel").innerText = "Pack is complete yet! ( SerialNumber: " + response.serialNumber + ")"
            }
        })
    } else {
        console.log("error")
        swal.fire({
            title: "Invalid SerialNumber! ( " + document.getElementById("packSerialNumber").value + ")",
            type: 'warning',
            confirmButtonText: 'OK'
        });
        document.getElementById("packSerialNumber").value = null;
       //document.getElementById("packlabel").innerText = "Invalid SerialNumber ( " + document.getElementById("packSerialNumber").value + "), pack is uncomplete.";
    }
}

async function packSN(product) {
    let s = product.serialNumber;
    $.ajax({
        method: "POST",
        url: "/Product/packSN",
        dataType: "json",
        data: { s: s }
    }).done(function (response) {
        swal.fire({
            title: "Pack is completed. SerialNumber: " + response.serialNumber,
            type: 'success',
            confirmButtonText: 'OK'
        });
        document.getElementById("packSerialNumber").value = null;
        //document.getElementById("packlabel").innerText = "Pack is completed. ( SerialNumber " + response.serialNumber + ")";
    })
}