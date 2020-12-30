SELECT *,
if(tl.unidade ="Dias", 
	date_add(ev.dataProximoEvento, interval tl.quantidade day),"Nao"
)
	
FROM ard.Timeline tl
inner join eventos ev on ev.id = tl.eventoId;