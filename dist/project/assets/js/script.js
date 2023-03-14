$(document).ready(function(){
    $('.drop').click(function(){
        $(this).closest('li').toggleClass('active'); 
    });
    $('.dropdown .select').click(function(){
        $(this).parent().find('.result').toggle(); 
    });
    $('#search').click(function(){
        $('tr.search').toggle();
        $(this).toggleClass('active')
    });
});