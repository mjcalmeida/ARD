$(document)
.ready(function(){
    $(".money")
    .inputmask(
        'decimal', 
        {   'alias': 'numeric',
            'groupSeparator': '.',
            'autoGroup': true,
            'digits': 2,
            'radixPoint': ",",
            'digitsOptional': false,
            'allowMinus': false,
            'prefix': '',
            'placeholder': '0,00'
        }
    );
})
