
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
  let faqdetail= $("#faq_table").DataTable();
  //faq detail list 
  function faq_detail(){
    faqdetail.clear().draw();
    $.ajax({
      url:"/api/faqs",
      type:"get",
      dataType:"json"
    }).done(function(response){
      $.each(response,function(key,value){
        let id = value._id;
        let num = key+1;
        let question = value.question.length>30?value.question.slice(0,30)+" . . .":value.question;
        let answer = value.answer.length>30?value.answer.slice(0,30)+" . . . ":value.answer;
        let button=`
        <button type="submit" name="detail" data-id=${id} class="btn btn-sm btn-outline-default rounded-0 data_detail p-1">Detail</button>
         <button type="submit" name="button" data-id=${id} class="btn btn-sm btn-outline-info rounded-0 edit_data p-1" data-toggle="modal" data-target="#editModal">Edit</button>
          <button type="submit" name="button" data-id=${id} class="btn btn-sm btn-outline-danger rounded-0 delete_data p-1">Delete</button>
         `;

        faqdetail.row.add(
          [num,question,answer,button]
        ).draw();
      });
    }).fail(function(error){
      console.log(error);
    });
  }

  
  $(function(){

    faq_detail();

  //insert faqs list
  $('.summernote').summernote('code');
  $('.usummernote').summernote('code');
  $(document).on('submit','#faq_create',e=>{
    e.preventDefault();
    $.ajax({
      url :"/admin/faqs",
      type:"POST",
      data : {
        question:e.target.question.value,
        answer:e.target.answer.value
        }
    }).done(function(response){
      faq_detail();
      $("#addModal").modal('hide');
        $("#faq_create")[0].reset();
        $('.summernote').summernote('code','');
        console.log(response);
    }).fail(function(error){
        console.log(error);
    });
   
  });

  //details
 $(document).on('click','.data_detail',e=>{
  let id = $(e.target).data('id');
  window.location.href='/admin/faqs/'+id;
 })


    //Delete
    $(document).on('click','.delete_data',function(){
      if(confirm("Are U Sure?")){

        let id = $(this).data('id');
        $.ajax({
          url:"/admin/faqs/"+id,
          type:"DELETE",
        }).done(function(response){
          faq_detail();
          console.log(response);
        }).fail(function(error){
          console.log(error);
        });
      }
  });

  //Update
     //get data
     $(document).on('click','.edit_data',function(){
      let id = $(this).data('id');
      $.ajax({
        url:"/admin/faqs/edit/"+id,
        type:"get",
      }).done(function(response){
        console.log(response);
        $('#uquestion').val(response.question);
        $('.usummernote').summernote('code',response.answer);
        $('#uid').val(response._id);
      }).fail(function(error){
        console.log(error);
      });
    });
  
    //updates
    $(document).on('submit','#faq_update',e=>{
      e.preventDefault();
      $.ajax({
        url :"/admin/faqs/edit/"+e.target.id.value,
        type:"PATCH",
        data : {
            answer:e.target.uanswer.value,
            question:e.target.question.value
          }
      }).done(function(response){
        faq_detail();
        $("#editModal").modal('hide');
          $("#faq_update")[0].reset();
          console.log(response);
      }).fail(function(error){
          console.log(error);
      });
     
    });

});
