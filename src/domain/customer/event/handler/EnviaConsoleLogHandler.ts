import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ChangeAddress from "../change-address.event";

export default class EnviarConsoleLogHandler
  implements EventHandlerInterface<ChangeAddress>
{
  handle(event: ChangeAddress): void {
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`); 
  }
}
