Select ep.pessoaID, 
(Count(ep.pessoaId) * 10) - sum(ep.valorPago) as Saldo
from eventosparticipantes ep
group by pessoaID
having Saldo <> 0;

Select ep.pessoaID, 
Count(ep.pessoaId) * 10, sum(ep.valorPago)
from eventosparticipantes ep
group by pessoaID
