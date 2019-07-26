async function kittingSNTap() {
    let selectedSerialNumber = document.getElementById("serialNumber").value
    if (selectedSerialNumber != null & selectedSerialNumber.length === 14) {            
        console.log(selectedSerialNumber)
            $.ajax({
                method: "POST",
                url: "/Product/getProductBySN",
                dataType: "json",
                data: { serialnum: selectedSerialNumber }
            }).done(function (response) {
                if (response.stationID === 1) {
                    console.log(response)
                    kittingSN(response);
                } else if (response.stationID === 2) {
                    swal.fire({
                        title: "Go to the Assembly station!",
                        type: 'warning',
                        confirmButtonText: 'OK'
                    });
                    //alert("Go to the Assembly station!")
                    document.getElementById("serialNumber").value = null;
                    document.getElementById("kittinglabel").innerText = ""
                }
                else if (response.stationID === 3) {
                    swal.fire({
                        title: "Go to the Pack station!",
                        type: 'warning',
                        confirmButtonText: 'OK'
                    });
                    //alert("Go to the Pack station!")
                    document.getElementById("serialNumber").value = null;
                    document.getElementById("kittinglabel").innerText = ""
                }
                else if (response.stationID === 4) {
                    swal.fire({
                        title: "Alert!",
                        text: "Pack is complete!",
                        type: 'warning',
                        confirmButtonText: 'OK'
                    });
                    //alert("Pack is complete!")
                    document.getElementById("serialNumber").value = null;
                    document.getElementById("kittinglabel").innerText = ""
s                }
            })
    } else {
        swal.fire({
            title: "Invalid serial number!",
            type: 'warning',
            confirmButtonText: 'OK'
        });
        //alert("Invalid serial number!");
        document.getElementById("serialNumber").value = null;
        document.getElementById("kittinglabel").innerText = "" 
    }
}

async function getWeight() {
    var sn = document.getElementById("serialNumber").value;
    if (sn.length === 0) {
        swal.fire({
            title: "Read the serial number of product!",
            type: 'warning',
            confirmButtonText: 'OK'
        });
        //alert("Read the serial number of product!")
    } else {
        $.ajax({
            method: "POST",
            url: "/Kitting/getWeightBySN",
            dataType: "json",
            data: { sn: sn }
        }).done(function (response) {
            var tWeight = response.weight;
            readWeight(tWeight);
        })
    }
}

async function readWeight(tWeight){
    var sn = document.getElementById("serialNumber").value;
    $.ajax({
        method: "POST",
        url: "/Kitting/readWeight",
        dataType: "json",
        data: { sn: sn }
    }).done(function (response) {
        var weight = response;
        if (weight === -1 || tWeight === 0) {
            console.log("Error");
        }
        else if (weight >= tWeight + 1 || weight <= tWeight - 1) {
            swal.fire({
                title: "Your weight (" + weight + "g) is out of target weight (" + tWeight + "g) !",
                type: 'warning',
                confirmButtonText: 'OK'
            });
            //alert("Your weight (" + weight + "g) is out of target weight (" + tWeight + "g) !")
            towerLight(0);
        }
        else if (weight === 0) {
            swal.fire({
                title: "Put the kitted parts on the scale!",
                type: 'warning',
                confirmButtonText: 'OK'
            });
        }
        else {
            setWeight(weight);
        }
    })    
}

async function towerLight(relay) {
    $.ajax({
        method: "POST",
        url: "/Kitting/controlLight",
        dataType: "json",
        data: { relay : relay } 
    }).done(function () {
        console.log("ok");
    })
}

async function setWeight(w) {
    var sn = document.getElementById("serialNumber").value;
    $.ajax({
        method: "POST",
        url: "/Kitting/setWeight",
        dataType: "json",
        data: { sn: sn, w:w }
    }).done(function () {
        if (response = true) {
            towerLight(1);
            swal.fire({
                title: "Go to the Assembly station!",
                type: 'warning',
                confirmButtonText: 'OK'
            });
            document.getElementById("serialNumber").value = null;
        } else {
            console.log("error")
        }
    })
}

async function kittingSN(product) {
    let p = product;
    console.log(p);
    var array = [];
    $.ajax({
        method: "POST",
        url: "/Kitting/GetDeficient",
        dataType: "json",
        data: { p: p }
    }).done(function (response) {
        if (response != null) {
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                array.push(response[i].partName);
            }
            swal.fire({
                title: 'Part shortage!',
                html: array + '. </br></br><b>Go ' + '<a href="PutToLight">Put To Light</a>' + ' station!</b>',
                type: 'warning',
                confirmButtonText: 'OK',
            });
            $("#bomlist").empty();
            document.getElementById("kittinglabel").innerText = " ";
            document.getElementById("serialNumber").value = null;
        } else {
            $.ajax({
                method: "POST",
                url: "/Kitting/GetBoms",
                dataType: "json",
                data: { p: p }
            }).done(function (response) {
                $.each(response, function (k, v) {
                    $("#bomlist").append($('<li>', {
                        value: v["id"],
                        text: v["partName"]
                    }));
                });
                $.ajax({
                    method: "POST",
                    url: "/Kitting/InsertToPTL",
                    dataType: "json",
                    data: { p: response }
                }).done(function () {
                    document.getElementById("kittinglabel").innerText = "BOM list loaded."
                })
            })
        }
        })
}