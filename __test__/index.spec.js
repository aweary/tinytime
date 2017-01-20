import tinytime from '../src'

// My birthday!
const date = new Date('September 24, 1992 021:07:30');

// Helper function to render template with the same date.
const render = template => tinytime(template).render(date)

describe('tinytime', () => {
  it('should export a function', () => {
    expect(typeof tinytime).toBe('function')
  });
  it('should return a template object', () => {
    const template = tinytime('The month is {MMMM}');
    expect(typeof template).toBe('object')
  });
  describe('rendering', () => {
    it('should let you render with a date/time', () => {
      expect(render('{h}:{mm}:{ss}{a} on a {dddd}.')).toEqual('9:07:30PM on a Thursday.');
    });
    it('full months', () => {
      expect(render('{MMMM}')).toEqual('September');
    });
    it('partial months', () => {
      expect(render('{MM}')).toEqual('Sep');
    });
    it('full years', () => {
      expect(render('{YYYY}')).toEqual('1992');
    });
    it('partial years', () => {
      expect(render('{YY}')).toEqual('92');
    })
    it('days of the week', () => {
      expect(render('{dddd}')).toEqual('Thursday');
    });
    it('day of the month', () => {
      expect(render('{Do}')).toEqual('24th');
    })
    it('times', () => {
      expect(render('{h}:{mm}:{ss}{a}')).toEqual('9:07:30PM');
    });
    it('user text with subsitutions', () => {
      expect(render(
        'It was {h}:{mm}:{ss}{a} on {MMMM} {Do}, {YYYY}.'
      )).toEqual(
        'It was 9:07:30PM on September 24th, 1992.'
      )
    });
  });
});