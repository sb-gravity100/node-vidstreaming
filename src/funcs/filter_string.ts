import * as _ from 'lodash';

export const format = (filter?: string, max?: number) => {
   if (!filter) {
      return null;
   }
   const maxLength = max || 1000;
   let filth = filter.trim() || '';
   const testReg = /(R\s+)?(\d+,?\s*)+/g;
   const rangeReg = /\d+-\d+/g;
   console.log(filth.match(testReg));
   if (filth.match(testReg)) {
      const rangeTest = filth.match(rangeReg);
      const rangeObj: number[][] = rangeTest
         ? rangeTest.map((v: any): number[] => {
              let [a, b] = v.split('-').map(Number);
              let range: number[];
              if (_.gt(a, b)) {
                 if (a > maxLength) {
                    a = maxLength;
                 }
                 range = _.range(b, a + 1);
              } else {
                 if (b > maxLength) {
                    b = maxLength;
                 }
                 range = _.range(a, b + 1);
              }
              return range;
           })
         : [];
      const ranges = _.chain(rangeObj).flattenDeep().uniq().value();
      console.log(filth);
      const newFilter = filth
         .replace(/,*/g, ' ')
         .replace(/\s*/g, ' ')
         .split(' ')
         .map((v: any) => {
            if (_.isNumber(Number(v))) {
               return Number(v);
            }
            return v;
         });
      return _.sortBy(
         _.uniq(
            _.concat(newFilter, ranges).filter(
               (r, k) => r === 'R' || _.isNumber(r)
            )
         )
      );
   }
};
