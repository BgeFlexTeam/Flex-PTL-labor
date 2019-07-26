function fillPartTap() {
    var p = document.getElementById("partNum").value;
    var qty = document.getElementById("qty").value;
    $.ajax({
        method: "POST",
        url: "/Part/getPartByPN",
        dataType: "json",
        data: { partnum: p }
    }).done(function (response) {
        var partnum = response.code;
        $.ajax({
            method: "POST",
            url: "/Part/InsertToPTL",
            dataType: "json",
            data: { p: response, qty: qty }
        }).done(function () {
            fillPart(partnum, qty);
        })
    })
}

function fillPart(part, qty) {
    $.ajax({
        method: "POST",
        url: "/Part/fillPart",
        dataType: "json",
        data: { p: part, quantity: qty }
    }).done(function (response) {
        if (response = true) {
            swal.fire({
                title: "Save is success!",
                type: 'success',
                confirmButtonText: 'OK'
            });
            document.getElementById("partNum").value = null;
            document.getElementById("qty").value = null;
        } else {
            swal.fire({
                title: "Save is unsuccessful!",
                type: 'warning',
                confirmButtonText: 'OK'
            });
            document.getElementById("partNum").value = null;
            document.getElementById("qty").value = null;
        }
    })
}


function showQty() {
    var modal = document.getElementById('myModal');
    $.ajax({
        method: "POST",
        url: "/Part/getParts",
        dataType: "json",
    }).done(function (response) {
        //console.log(response);
        $(".modal-content").html("");
        var content = "";
        content += '<table id="responseTable" class="display"><thead><tr> <th>Zone</th> <th>Name</th> <th>Part name</th> <th>Code</th> <th>Quantity</th></tr></thead><tbody>';
        $.each(response, function (k, v) {
            //alert("current response: " + response[k].zone);
            content += '<tr>'
                + '<td>' + response[k].zone + '</td>'
                + '<td>' + response[k].name + '</td>'
                + '<td>' + response[k].partName + '</td>'
                + '<td>' + response[k].code + '</td>'
                + '<td>' + response[k].qty + '</td></tr>';
        });
        content += '</tbody></table>';
        $(".modal-content").html(content);
        $("#responseTable").DataTable();
        modal.style.display = "block";
    })
}


var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById('myModal');

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

