import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
    async index(req, res) {
        // metodo de List

        const { page = 1 } = req.query;
        const appointments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['url', 'id', 'path'],
                        },
                    ],
                },
            ],
        });

        return res.json(appointments);
    }

    async store(req, res) {
        // metodo de create
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: ' Validation fails' });
        }

        const { provider_id, date } = req.body;

        // CHECK SE PROVIDER_ID È UM PROVIDER
        // Check if provider_id is a provider

        const CheckisProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!CheckisProvider) {
            return res
                .status(401)
                .json({ error: ' You can only create appointments' });
        }

        // CHECK IS USER A THE PROVIDER
        const { userId } = req;

        if (provider_id === userId) {
            return res.status(401).json({
                error:
                    'Provider is not  permitted create appointment for yourself ',
            });
        }

        // Check for past dates
        const hourStart = startOfHour(parseISO(date)); // convertendo os minutos e segundos p/ 00:00 p/ ter hora completa

        if (isBefore(hourStart, new Date())) {
            // Validando se hourStart vem antes da data atual, se sim return err
            return res
                .status(400)
                .json({ error: 'Past dates are not permitted' });
        }
        // fim check for past dates

        // check date availability (Disponivel)
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });

        // se retornar true:
        if (checkAvailability) {
            return res
                .status(400)
                .json({ error: 'Past dates are not permitted' });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date: hourStart,
        });

        /**
         * Notificar prestador de Serviço / Notify provider ;
         */

        const user = await User.findByPk(req.userId);
        const formattedDate = format(
            hourStart,
            " 'Dia' dd 'de' MMMM, 'às' H:mm'h' ",
            { locale: pt }
        );

        await Notification.create({
            content: `Novo Agendamento de ${user.name} para ${formattedDate}...`,
            user: provider_id,
        });

        return res.json(appointment);
    }

    async delete(req, res) {
        const appointment = await Appointment.findByPk(req.params.id);

        if (appointment.user_id !== req.userId) {
            return res.status(401).json({
                error: "You don't have permission to cancel this appointment",
            });
        }

        const dateWithSub = subHours(appointment.date, 2);

        if (isBefore(dateWithSub, new Date())) {
            return res.status(401).json({
                error: 'You can only cancel appointments 2 hours in advance',
            });
        }

        appointment.canceled_at = new Date();

        await appointment.save();
        return res.json(appointment);
    }
}

// First Commit in this Backend do in 29/02/2020||15:43h
// Coment for teste 2

export default new AppointmentController();
