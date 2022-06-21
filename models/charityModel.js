// model Charity {
//     id        Int        @id @default(autoincrement())
//     name      String?    @db.VarChar(45)
//     image     String?    @db.VarChar(300)
//     donations Donation[]
//     Campaign  Campaign[]
//   }

const { Schema, model } = require('mongoose');

const charitySchema = new Schema({
  name: String,

  image: String,

  donations: [{ type: Schema.Types.ObjectId, ref: 'Donation' }],

  campaign: [{ type: Schema.Types.ObjectId, ref: 'Campaign' }],
});

const Charity = model('Charity', charitySchema);

module.exports = Charity;
