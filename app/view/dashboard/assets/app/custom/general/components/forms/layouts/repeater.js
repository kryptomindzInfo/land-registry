
"use strict";
// Class definition

var KTRepeaterDemo = function () {
    
    // Private functions
    
    var demo = function () {
        var count = 0;
        var owner = 1
        $('.kt-repeater').each(function(){
            //console.log(this)
            
            
            $(this).repeater({
                
                show: function () {
                    ++owner;
                  // console.log(this);
                 // alert("")
                  $(this).find("#owner_count").html('Owner -'+owner)
                   if($("input:radio[name=ownership_type]:checked").val() == 2){
                        $(this).find(".close_div").show();
                    }else{
                        $(this).find(".close_div").hide();
                    }
                    var data=$(this);
                    if($('#certificate_type').val() == 1){
                        $(this).find("#lbl_upload_file_name").html('Upload Title <span class="astrick_color">*</span>')
                    } else {
                        $(this).find("#lbl_upload_file_name").html('File Name <span class="astrick_color">*</span>')
                    }
                    var type = $(this).find("#filetype").addClass('file_type'+ count)
                    var types = $(this).find("#doc_upload").addClass('doc_uploads'+ count)
                    //var birth_date = $(this).find("#birthdate").addClass('birthdate'+ count)
                    var file = $(this).find("#file_hash").addClass('file_hash'+ count)
                    var file_name = $(this).find("#file_name").addClass('file_name'+ count)
                    var action = ''
                    var dropzoneId = $(this).find('.my_dropzone').attr('id')
                    
                    console.log(dropzoneId)
                    $(this).find("#share_value").change(function () {
                        var share_per=0;
                        $('.owner_user').each(function () {
                            share_per += parseInt($(this).find("#share_value").val()) 
                            if(share_per > 100){
                                $(this).find("#share_value").css("border-color", "#fd397a");
                                $(this).find("#share-error").show();
                                $("#next_btn").hide();
                            }else{
                                $(this).find("#share_value").css("border-color", "#ebedf2");
                                $(this).find("#share-error").hide();
                                $("#next_btn").show();
                            }
                        })

                        console.log(share_per)
                    })
                    $(".file_type"+ count).change(function () {
                        if(this.value==''){
                            $(types).hide();
                        }else{
                         $(types).show();
                        }
                        action = '/addLandRecords?type=' + $(this).val() + '&class=' + data.find('#file_hash').prop('class') + '&name=' + data.find('#file_name').prop('class')
                        data.find('.my_dropzone').attr('action', action)
                        data.find('#'+dropzoneId).dropzone({
                            url: action,
                            addRemoveLinks: true,
                        })
                    })

                    

                    console.log($(this).find('.my_dropzone').attr('action'))
                    count++
                    var dyname =$(this).find("#national_tanz").prop("class");
                    var date_att = $(this).find('#birthdate').attr('data-date-id', 'birthdate'+ count)
                    var birthdate =$(this).find('.birthdate').prop('name');
                    console.log(dyname, birthdate, date_att.data('date-id'));
                    
                    $(this).find('input[type=radio][class='+dyname+']').change(function() {
                        if($(this).val() == 1){
                            data.find("#nationality_id").attr("placeholder", "Enter Invester ID");
                            data.find("#lbl_nationality_id").html('Invester ID: <span class="astrick_color">*</span>');
                        }else{
                            data.find("#nationality_id").attr("placeholder", "Enter Nationality ID");
                            data.find("#lbl_nationality_id").html('Nationality ID: <span class="astrick_color">*</span>')
                        }
                    })

                    $(this).find("input[name='"+ birthdate +"']").datepicker({
                        dateFormat : 'dd/mm/yy',
                        changeMonth : true,
                        changeYear : true,
                        yearRange: '-100y:c+nn',
                        maxDate: '-1d'
                    });


            
                    $(this).slideDown();
                },
                // Enable the option below to have a 2-step remove button
                /*
                hide: function (deleteElement) {
                    if(confirm('Are you sure you want to delete this element?')) {
                        $(this).slideUp(deleteElement);
                    }
                },
                */
                isFirstItemUndeletable: true
            });
        });
    }

    return {
        // public functions
        init: function() {
            demo(); 
        }
    };
}();

jQuery(document).ready(function() {    
    KTRepeaterDemo.init();
});