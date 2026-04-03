import { Injectable, Logger } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidoService } from './pedido.service';

@Injectable()
export class PedidoConsumerService {
	private readonly logger = new Logger(PedidoConsumerService.name);

	constructor(private readonly pedidoService: PedidoService) {}

	async consumirManualmente(payload: CreatePedidoDto) {
		this.logger.log(`Ingestao manual recebida para pedido ${payload.uuid}`);
		return this.pedidoService.salvarPedidoDoMarketplace(payload);
	}
}

