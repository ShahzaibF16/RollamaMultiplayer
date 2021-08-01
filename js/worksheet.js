if(diff){
    if(diff == "0"){
        $('#diffselect option:eq(0)').prop('selected', true);
   }
   else if(diff == "1"){
    $('#diffselect option:eq(1)').prop('selected', true);
   }
   else if(diff == "2"){
    $('#diffselect option:eq(2)').prop('selected', true);
   }
}

$("#diffselect").change(function(){
    if($(this).val() == "0"){
        Cookies.set("llama_diff", "0");
    }
    if($(this).val() == "1"){
        Cookies.set("llama_diff", "1");
    }
    if($(this).val() == "2"){
        Cookies.set("llama_diff", "2");
    }
    location.reload();
})