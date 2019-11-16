$(function () {
    var table = $('#example').DataTable({
        "language": {
            "lengthMenu": "Her sayfada _MENU_ kadar kayıt görüntüle",
            "zeroRecords": "Üzgünüz, kayıt bulunamadı.",
            "info": "_PAGES_ sayfa arasından _PAGE_. sayfadasınız.",
            "infoEmpty": "Kayıt yok.",
            "infoFiltered": "(_MAX_ toplam kayıt arasından filtrelendi)",
            "search": "Ara",
            "paginate": {
                "first": "İlk",
                "last": "Son",
                "next": "Sonraki",
                "previous": "Önceki"
            },
        }
    });
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('whatever')
        var modal = $(this)
        modal.find('.modal-title').text('New message to ' + recipient)
        modal.find('.modal-body input').val(recipient)
    })

    $("#kaydetButonu").on('click', () => {
        var newData = { username: getUsername(), sehir: $("#sehir").val(), yil: $('#yil').val() };
        $.ajax({
            url: "/yeniSeyahatEkle",
            context: document.body,
            method: 'POST',
            data: newData
        }).done(function (result) {
            table.row.add(Object.values(newData)).draw();
            $('#yeniKayitEkleModal').modal('hide');
        });
    })
});

function getUsername() {
    return $('#__username').val();
}