import { TOP_LEVEL_OPERATORS_GQL_MAP } from '../mappers/sequelize-gql-operators-map';
import { newLine } from './new-line';
import { inputGql } from './types';
import { whereInputFilterEnumGql, whereOperatorFiltersInputGql } from './where-operator-filters';

// const input2 = {
//   where: {
//     AND: [{ dealStatus: { OR: ['foo', 'bar'] } }, { createdAt: { BETWEEN: ['1-11-2021', '1-26-2021']}}],
//   },
// };

// const leadRoomsInput = {
//   where: {
//     name: { LIKE: 'foo' }
//   }
// }

// // leadRoom.name

// const fooQuery = `
//   lead(input: ${input2}) {
//     leadRooms(input: ${leadRoomsInput}) {
//       id
//     }
//   }
// `

// const result = await Lead.findOne({
//   where: {
//     [Op.and]: [{
//       dealStatus: {
//         [Op.or]: ['foo', 'bar']
//       },
//     },
//     {

//     }
//     ]
//   }
//   include: [{ association: 'leadRoom'}]
// })

// const input = {
//   where: {
//     id: 7,
//     AND: [{ id: 1 }, { id: 3 }],
//     OR: [{ id: 1 }, { id: 3 }],
//     FILTERS: {
//       name: { LIKE: 'da' },
//       sortOrder: { GTE: 1 },
//       createdAt: { BETWEEN: ['11-01-2021', '11-30-2021'] },
//     }, // TODO
//   },
//   options: {
//     limit: 10,
//     skip: 10,
//   },
// };

// const foo = `

//   type Lead {
//     ...fields
//   }

//   input LeadWhereInput {
//     id: Int
//     status: Status
//     dealStatus: DealStatus
//     createAt: DateTime
//     AND: [LeadWhereInput]
//     OR: [LeadWhereInput]
//     FILTERS:
//   }

// `

export const whereInputGql = (name, whereAttributes, options) => {
  const whereInputName = `${name}WhereInput`;

  const { gql: operatorsGql, whereInputFilterFields } = whereOperatorFiltersInputGql(
    name,
    whereInputName,
    whereAttributes,
    options
  );

  const whereAttributesFieldsGql = whereAttributes
    .map((x) => `${x.key}: ${x.value}`)
    .join(`${newLine()}`);

  return `
    ${inputGql()} ${whereInputName} {
      ${whereAttributesFieldsGql}
      ${whereInputFilterFields}
    }

    ${operatorsGql}
  `;
};
