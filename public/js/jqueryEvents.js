/** Attach jQuery events */
$('#evalInput').focus(function () {
	var boxShadow = 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(3,36,77,.6)';
	$('#submitButton').css('-moz-box-shadow', boxShadow);
	$('#submitButton').css('-webkit-box-shadow', boxShadow);
	$('#submitButton').css('box-shadow', boxShadow);
});
$('#evalInput').focusout(function () {
	$('#submitButton').css('-moz-box-shadow', 'none');
	$('#submitButton').css('-webkit-box-shadow', 'none');
	$('#submitButton').css('box-shadow', 'none');
});
$('#evalInput').on('keydown', function (e) {
	var code = e.keyCode ? e.keyCode : e.which;
	if (code == 13) {
		socket.emit('submitExpression', { expression: $('#evalInput').val() });
		$('#evalInput').val('');
	}
});
$('#submitButton').on('vclick', function () {
	socket.emit('submitExpression', { expression: $('#evalInput').val() });
	$('#evalInput').val('');
});
