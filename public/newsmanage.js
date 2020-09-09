$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
  },
});
let newsdetail = $('#news_table').DataTable();
//news detail list
function news_detail() {
  newsdetail.clear().draw();
  $.ajax({
    url: '/api/news',
    type: 'get',
    dataType: 'json',
  })
    .done(function (response) {
      $.each(response, function (key, value) {
        let id = value._id;
        let num = key + 1;
        let newsImage = value.newsImage
          ? `<img src="/${value.newsImage}" alt="" style="width:30%;height:60px">`
          : `<img src="" alt="No Photo" style="width:30%;height:60px">`;
        let title =
          value.title.length > 30
            ? value.title.slice(0, 30) + ' . . .'
            : value.title;
        let body =
          value.body.length > 30
            ? value.body.slice(0, 30) + ' . . . '
            : value.body;
        let button = `
        <button type="submit" name="detail" data-id=${id} class="btn btn-sm btn-outline-default rounded-0 data_detail p-1">Detail</button>
         <button type="submit" name="button" data-id=${id} class="btn btn-sm btn-outline-info rounded-0 edit_data p-1" data-toggle="modal" data-target="#editModal">Edit</button>
          <button type="submit" name="button" data-id=${id} class="btn btn-sm btn-outline-danger rounded-0 delete_data p-1">Delete</button>
         `;

        newsdetail.row.add([num, newsImage, title, body, button]).draw();
      });
    })
    .fail(function (error) {
      console.log(error);
    });
}

$(function () {
  news_detail();

  //insert faqs list
  $('.summernote').summernote('code');
  $('.usummernote').summernote('code');
  $(document).on('submit', '#news_create', (e) => {
    e.preventDefault();

    var fd = new FormData();
    var files = $('#newsImage')[0].files[0];
    var title = e.target.title.value;
    var body = e.target.body.value;
    fd.append('newsImage', files);
    fd.append('title', title);
    fd.append('body', body);
    $.ajax({
      url: '/admin/news',
      type: 'POST',
      data: fd,
      contentType: false,
      processData: false,
      dataType: 'json',
    })
      .done(function (response) {
        news_detail();
        $('#addModal').modal('hide');
        $('#news_create')[0].reset();
        document.getElementById('preview-image-file').src =
          'https://dapp.dblog.org/img/default.jpg';
        $('.summernote').summernote('code', '');
        console.log(response);
      })
      .fail(function (error) {
        console.log(error);
      });
  });

  //details
  $(document).on('click', '.data_detail', (e) => {
    let id = $(e.target).data('id');
    window.location.href = '/admin/news/' + id;
  });

  //delete
  $(document).on('click', '.delete_data', (e) => {
    let id = $(e.target).data('id');
    if (confirm('Are You Sure')) {
      $.ajax({
        url: '/admin/news/' + id,
        method: 'DELETE',
      })
        .done((response) => {
          news_detail();
          console.log(response);
        })
        .fail((error) => console.log(error));
    }
  });

  //edit
  //get data to edit
  $(document).on('click', '.edit_data', function () {
    let id = $(this).data('id');
    $.ajax({
      url: '/admin/news/edit/' + id,
      type: 'get',
    })
      .done(function (response) {
        console.log(response);
        $('#preview-image-file-edit').attr('src', '/' + response.newsImage);
        $('#utitle').val(response.title);
        $('#ubody').summernote('code', response.body);
        $('#uid').val(response._id);
      })
      .fail(function (error) {
        console.log(error);
      });
  });

  $(document).on('submit', '#news_update', (e) => {
    e.preventDefault();
    var fd = new FormData();
    var files = $('#unewsImage')[0].files[0];
    var title = e.target.utitle.value;
    var body = e.target.ubody.value;
    fd.append('unewsImage', files);
    fd.append('utitle', title);
    fd.append('ubody', body);
    $.ajax({
      url: '/admin/news/edit/' + e.target.uid.value,
      type: 'PATCH',
      data: fd,
      contentType: false,
      processData: false,
      dataType: 'json',
    })
      .done(function (response) {
        news_detail();
        console.log(response);
        $('#editModal').modal('hide');
        $('#news_update')[0].reset();
        document.getElementById('preview-image-file-edit').src =
          'https://dapp.dblog.org/img/default.jpg';
        $('.usummernote').summernote('code', '');
      })
      .fail(function (error) {
        console.log(error);
      });
  });
});
