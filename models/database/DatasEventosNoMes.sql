Select 
	tl.eventoId,
	dataProximoEvento "Data",
    acao Ação,
    if(tl.unidade = "Dias", 
		if(tl.antesDepois = "-",
			date_sub(ev.dataProximoEvento, interval tl.quantidade day),
			date_add(ev.dataProximoEvento, interval tl.quantidade day)),
	if(tl.unidade = "Meses", 
		if(tl.antesDepois = "-",
			date_sub(ev.dataProximoEvento, interval tl.quantidade month),
			date_add(ev.dataProximoEvento, interval tl.quantidade month)),
	if(tl.unidade = "Anos", 
		if(tl.antesDepois = "-",
			date_sub(ev.dataProximoEvento, interval tl.quantidade day),
			date_add(ev.dataProximoEvento, interval tl.quantidade day)), 
		"Erro")
	)) dataAcao
from eventos ev
inner join Timeline tl on ev.id = tl.eventoId
where 
	day(dataProximoEvento) = 4
and month(dataProximoEvento) = 2
and year(dataProximoEvento) = 2021
order by dataAcao