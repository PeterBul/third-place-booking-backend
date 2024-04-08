import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as moment from 'moment';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  // @Cron('0 0 * * Tue,Fri')
  // async keepDbAlive() {
  //   const noneMemberUserCount = await this.prismaService.user.count({
  //     where: {
  //       roles: {
  //         none: {
  //           name: {
  //             equals: 'Member',
  //           },
  //         },
  //       },
  //     },
  //   });
  //   this.mail.sendEmail({
  //     to: this.config.get('ADMIN_EMAIL'),
  //     subject: 'Database kept alive',
  //     html: `A query was made to the database to keep it alive. There are ${noneMemberUserCount} users that have not gained member privileges.`,
  //   });
  // }
  @Cron('0 3 * * *')
  async nonAdmittedMember() {
    const noneMemberUserCount = await this.prisma.user.count({
      where: {
        roles: {
          none: {
            name: {
              equals: 'Member',
            },
          },
        },
      },
    });
    if (noneMemberUserCount === 0) {
      return;
    }
    this.mail.sendEmail({
      to: this.config.get('ADMIN_EMAIL'),
      subject: 'Pending member request',
      html: `There are ${noneMemberUserCount} users that have requested member access that have not been granted.`,
    });
  }

  @Cron('0 8 * * *')
  async remindToDeliver() {
    const users = await this.prisma.user.findMany({
      where: {
        Booking: {
          some: {
            returnDate: {
              lt: new Date(),
            },
            isReturned: {
              equals: false,
            },
          },
        },
      },
      select: {
        email: true,
        Booking: {
          where: {
            returnDate: {
              lt: new Date(),
            },
            isReturned: {
              equals: false,
            },
          },
        },
      },
    });
    users.forEach((user) => {
      const it = user.Booking.length > 1 ? 'them' : 'it';
      this.mail.sendEmail({
        to: user.email,
        subject: 'Reminder to deliver',
        html: /*html*/ `
        <!doctype html>
          <html>
            <head>
              <title>Reminder email</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
          	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          	<link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
              <style>
                p {
                  font-family: Montserrat, sans-serif;
                  margin-top: 0.8rem;
                  margin-bottom: 0;
              }
              .gap {
        	      margin-top: 30px;
              }
              </style>
            </head>
            <body>
              <p>Hi 👋</p>
                
              ${
                user.Booking.length > 1
                  ? /*html*/ `<p class="gap">You have bookings that were supposed to be delivered ${user.Booking.map((b, i) => moment(b.returnDate).format('MMMM Do') + (i < user.Booking.length - 1 ? ', ' : ' and '))}.</p>`
                  : /*html*/ `<p class="gap">You have a booking that was supposed to be delivered ${moment(user.Booking[0].returnDate).format('MMMM Do')}.</p>`
              }
              <p>
                If you have returned ${it}, please go to
                <a href="${this.config.get('WEB_URL')}/admin/bookings"
                  >Third Place Booking</a
                >
                and mark ${it} as returned.
              </p>
                
              <p>
                If you have not returned ${it}, please do so ASAP and please check if someone
                else has requested the items you have not delivered and make contact as
                needed 👽.
              </p>
              <p>
                If items are not available or damaged, i.e. due to a gremlin attack 🦉,
                please contact the member responsible for bookings, or anyone you can
                think of to get it sorted.
              </p>
              <p  class="gap">
                Best regards,<br />
                Third Place
              </p>
            </body>
          </html>
`,
      });
    });
  }
}
