const autoprefixer = require('../lib/autoprefixer')

const postcss = require('postcss')
const path = require('path')
const fs = require('fs')

const grider = autoprefixer({
  browsers: ['Chrome 25', 'Edge 12', 'IE 10'],
  cascade: false,
  grid: true
})

const cleaner = autoprefixer({
  browsers: []
})
const compiler = autoprefixer({
  browsers: ['Chrome 25', 'Opera 12']
})
const filterer = autoprefixer({
  browsers: ['Chrome 25', 'Safari 9', 'Firefox 39']
})
const borderer = autoprefixer({
  browsers: ['Safari 4', 'Firefox 3.6']
})
const cascader = autoprefixer({
  browsers: ['Chrome > 19', 'Firefox 21', 'IE 10'],
  cascade: true
})
const keyframer = autoprefixer({
  browsers: ['Chrome > 19', 'Opera 12']
})
const flexboxer = autoprefixer({
  browsers: ['Chrome > 19', 'Firefox 21', 'IE 10']
})
const without3d = autoprefixer({
  browsers: ['Opera 12', 'IE > 0']
})
const supporter = autoprefixer({
  browsers: ['Chrome 25', 'Chrome 28', 'IE > 0']
})
const uncascader = autoprefixer({
  browsers: ['Firefox 15']
})
const gradienter = autoprefixer({
  browsers: ['Chrome 25', 'Opera 12', 'Android 2.3']
})
const selectorer = autoprefixer({
  browsers: ['Chrome 25', 'Firefox > 17', 'IE 10', 'Edge 12']
})
const intrinsicer = autoprefixer({
  browsers: ['Chrome 25', 'Firefox 22', 'Safari 10']
})
const imagerender = autoprefixer({
  browsers: ['iOS 8', 'iOS 6.1', 'FF 22', 'IE 11', 'Opera 12']
})
const backgrounder = autoprefixer({
  browsers: ['Firefox 3.6', 'Android 2.3']
})
const resolutioner = autoprefixer({
  browsers: ['Safari 7', 'Opera 12']
})
const overscroller = autoprefixer({
  browsers: ['Edge 16']
})

function prefixer (name) {
  if (
    name === 'grid' ||
        name === 'grid-gap' ||
        name === 'grid-area' ||
        name === 'grid-template' ||
        name === 'grid-template-areas'
  ) {
    return grider
  } else if (name === 'keyframes') {
    return keyframer
  } else if (name === 'border-radius') {
    return borderer
  } else if (name === 'vendor-hack' || name === 'value-hack') {
    return cleaner
  } else if (name === 'mistakes') {
    return cleaner
  } else if (name === 'gradient') {
    return gradienter
  } else if (name === 'flexbox' || name === 'flex-rewrite') {
    return flexboxer
  } else if (name === 'double') {
    return flexboxer
  } else if (name === 'selectors' || name === 'placeholder') {
    return selectorer
  } else if (name === 'intrinsic' || name === 'multicolumn') {
    return intrinsicer
  } else if (name === 'cascade') {
    return cascader
  } else if (name === '3d-transform') {
    return without3d
  } else if (name === 'background-size') {
    return backgrounder
  } else if (name === 'background-clip') {
    return cleaner
  } else if (name === 'uncascade') {
    return uncascader
  } else if (name === 'example') {
    return autoprefixer
  } else if (name === 'viewport' || name === 'appearance') {
    return flexboxer
  } else if (name === 'resolution') {
    return resolutioner
  } else if (name === 'filter' || name === 'advanced-filter') {
    return filterer
  } else if (name === 'element') {
    return filterer
  } else if (name === 'image-rendering' || name === 'writing-mode') {
    return imagerender
  } else if (name === 'logical' || name === 'text-decoration') {
    return intrinsicer
  } else if (name === 'supports') {
    return supporter
  } else if (name === 'overscroll-behavior') {
    return overscroller
  } else {
    return compiler
  }
}

function read (name) {
  const file = path.join(__dirname, '/cases/' + name + '.css')
  return fs.readFileSync(file).toString()
}

function check (from, instance = prefixer(from)) {
  const input = read(from)
  const output = read(from + '.out')
  const result = postcss([instance]).process(input)
  expect(result.warnings()).toHaveLength(0)
  expect(result.css).toEqual(output)
}

const COMMONS = [
  'transition', 'values', 'keyframes', 'gradient', 'flex-rewrite',
  'flexbox', 'filter', 'border-image', 'border-radius', 'notes', 'selectors',
  'placeholder', 'fullscreen', 'intrinsic', 'mistakes', 'custom-prefix',
  'cascade', 'double', 'multicolumn', '3d-transform', 'background-size',
  'supports', 'viewport', 'resolution', 'logical', 'appearance',
  'advanced-filter', 'element', 'image-set', 'image-rendering',
  'mask-border', 'writing-mode', 'cross-fade', 'gradient-fix',
  'text-emphasis-position', 'grid', 'grid-area', 'grid-template',
  'grid-template-areas', 'grid-gap', 'color-adjust'
]

it('throws on wrong options', () => {
  expect(() => {
    autoprefixer({ browser: ['chrome 25', 'opera 12'] })
  }).toThrowError(/browsers/)
  expect(() => {
    autoprefixer({ browserslist: ['chrome 25', 'opera 12'] })
  }).toThrowError(/browsers/)
})

const options = {
  cascade: false,
  grid: false
}

const browsers = ['chrome 25', 'opera 12']

it('sets options via options object', () => {
  const allOptions = Object.assign(options, { browsers })

  const instance = autoprefixer(allOptions)
  expect(instance.options).toEqual(allOptions)
  expect(instance.browsers).toEqual(browsers)
})

it('sets options via array of browsers as first argument and object', () => {
  const instance = autoprefixer(browsers, options)
  expect(instance.options).toEqual(options)
  expect(instance.browsers).toEqual(browsers)
})

it('sets options via browsers as arguments and options object', () => {
  const instance = autoprefixer(...browsers, options)
  expect(instance.options).toEqual(options)
  expect(instance.browsers).toEqual(browsers)
})

it('has default browsers', () => {
  expect(autoprefixer.defaults.length).toBeDefined()
})

it('passes statistics to Browserslist', () => {
  const stats = {
    chrome: {
      10: 10,
      11: 40
    },
    ie: {
      10: 10,
      11: 40
    }
  }
  expect(autoprefixer({ browsers: '> 20% in my stats', stats }).info())
    .toMatch(/Browsers:\n\s\sChrome: 11\n\s\sIE: 11\n/)
})

it('prefixes values', () => check('values'))
it('prefixes @keyframes', () => check('keyframes'))
it('prefixes @viewport', () => check('viewport'))
it('prefixes selectors', () => check('selectors'))
it('prefixes resolution query', () => check('resolution'))
it('removes common mistakes', () => check('mistakes'))
it('reads notes for prefixes', () => check('notes'))
it('keeps vendor-specific hacks', () => check('vendor-hack'))
it('keeps values with vendor hacks', () => check('value-hack'))
it('works with comments', () => check('comments'))
it('uses visual cascade', () => check('cascade'))
it('works with properties near', () => check('double'))
it('checks prefixed in hacks', () => check('check-down'))
it('normalize cascade after remove', () => check('uncascade'))
it('prefix decls in @supports', () => check('supports'))
it('saves declaration style', () => check('style'))
it('uses ignore next control comments', () => check('ignore-next'))
it('uses block control comments', () => check('disabled'))
it('has actual example in docs', () => check('example'))

it('uses control comments to whole scope', () => {
  const input = read('scope')
  const output = read('scope.out')
  const result = postcss([prefixer('scope')]).process(input)

  expect(result.css).toEqual(output)
  expect(result.warnings().map(i => i.toString())).toEqual([
    'autoprefixer: <css input>:5:5: Second Autoprefixer control comment ' +
        'was ignored. Autoprefixer applies control comment to whole block, ' +
        'not to next rules.'
  ])
})

it('prefixes transition', () => {
  const input = read('transition')
  const output = read('transition.out')
  const result = postcss([prefixer('transition')]).process(input)

  expect(result.css).toEqual(output)
  expect(result.warnings().map(i => i.toString())).toEqual([
    'autoprefixer: <css input>:23:5: Replace transition-property ' +
        'to transition, because Autoprefixer could not support any cases ' +
        'of transition-property and other transition-*'
  ])
})

it('works with broken transition', () => {
  const input = 'a{transition:,,}'
  const output = 'a{-webkit-transition:;-o-transition:;transition:}'
  const result = postcss([prefixer('transition')]).process(input)
  expect(result.css).toEqual(output)
})

it('should ignore spaces inside values', () => {
  const css = read('trim')
  expect(postcss([flexboxer]).process(css).css).toEqual(css)
})

it('removes unnecessary prefixes', () => {
  const processor = postcss([cleaner])
  for (const type of COMMONS) {
    if (type === 'gradient-fix') continue
    if (type === 'cascade') continue
    if (type === 'mistakes') continue
    if (type === 'flex-rewrite') continue
    if (type === 'grid') continue
    if (type === 'grid-gap') continue
    if (type === 'grid-area') continue
    if (type === 'grid-template') continue
    if (type === 'grid-template-areas') continue
    const input = read(type + '.out')
    const output = read(type)
    expect(processor.process(input).css).toEqual(output)
  }
})

it('media does not should nested', () => {
  const processor = postcss([grider])
  const input = read('grid-media-rules')
  const output = read('grid-media-rules.out')
  expect(processor.process(input).css).toEqual(output)
})

it('does not remove unnecessary prefixes on request', () => {
  for (const type of ['transition', 'values', 'fullscreen']) {
    const keeper = autoprefixer({ browsers: [], remove: false })
    const css = read(type + '.out')
    expect(postcss([keeper]).process(css).css).toEqual(css)
  }
})

it('does not add prefixes on request', () => {
  for (const type of ['transition', 'values', 'fullscreen']) {
    const remover = autoprefixer({ browsers: ['Opera 12'], add: false })
    const unprefixed = read(type)
    expect(postcss([remover]).process(unprefixed).css).toEqual(unprefixed)
  }
})

it('prevents doubling prefixes', () => {
  for (const type of COMMONS) {
    const processor = postcss([prefixer(type)])
    const input = read(type)
    const output = read(type + '.out')
    expect(processor.process(processor.process(input)).css).toEqual(output)
  }
})

it('parses difficult files', () => {
  const input = read('syntax')
  const result = postcss([cleaner]).process(input)
  expect(result.css).toEqual(input)
})

it('marks parsing errors', () => {
  expect(() => {
    postcss([cleaner]).process('a {').css
  }).toThrowError('<css input>:1:1: Unclosed block')
})

it('shows file name in parse error', () => {
  expect(() => {
    postcss([cleaner]).process('a {', { from: 'a.css' }).css
  }).toThrowError(/a.css:1:1: /)
})

it('uses browserslist config', () => {
  const from = path.join(__dirname, 'cases/config/test.css')
  const input = read('config/test')
  const output = read('config/test.out')
  const processor = postcss([autoprefixer])
  expect(processor.process(input, { from }).css).toEqual(output)
})

it('sets browserslist environment', () => {
  const from = path.join(__dirname, 'cases/config/test.css')
  const input = read('config/test')
  const output = read('config/test.production')
  const processor = postcss([autoprefixer({ env: 'production' })])
  expect(processor.process(input, { from }).css).toEqual(output)
})

it('works without source in nodes', () => {
  const root = postcss.root()
  root.append({ selector: 'a' })
  root.first.append({ prop: 'display', value: 'flex' })
  compiler(root)
  expect(root.toString()).toEqual(
    'a {\n    display: -webkit-flex;\n    display: flex\n}')
})

it('takes values from other PostCSS plugins', () => {
  function plugin (root) {
    root.walkDecls(i => {
      i.value = 'calc(0)'
    })
  }
  const result = postcss([plugin, compiler]).process('a{width:0/**/0}')
  expect(result.css).toEqual('a{width:-webkit-calc(0);width:calc(0)}')
})

it('has option to disable @supports support', () => {
  const css = '@supports (cursor: grab) {}'
  const instance = autoprefixer({ browsers: ['Chrome 28'], supports: false })
  const result = postcss([instance]).process(css)
  expect(result.css).toEqual(css)
})

it('has disabled grid options by default', () => {
  const ap = autoprefixer({ browsers: ['Edge 12', 'IE 10'] })
  const input = read('grid')
  const output = read('grid.disabled')
  const result = postcss([ap]).process(input)
  expect(result.css).toEqual(output)
})

it('has option to disable flexbox support', () => {
  const css = read('flexbox')
  const instance = autoprefixer({ browsers: ['IE 10'], flexbox: false })
  const result = postcss([instance]).process(css)
  expect(result.css).toEqual(css)
})

it('has option to disable 2009 flexbox support', () => {
  const ap = autoprefixer({ browsers: ['Chrome > 19'], flexbox: 'no-2009' })
  const css = 'a{flex:1;transition:flex}'
  const result = postcss([ap]).process(css)
  expect(result.css).toEqual('a{' +
        '-webkit-flex:1;flex:1;' +
        '-webkit-transition:-webkit-flex;transition:-webkit-flex;' +
        'transition:flex;transition:flex, -webkit-flex' +
    '}')
})

it('returns inspect string', () => {
  expect(autoprefixer({ browsers: ['chrome 25'] }).info())
    .toMatch(/Browsers:\s+Chrome: 25/)
})

it('uses browserslist config in inspect', () => {
  const from = path.join(__dirname, 'cases/config')
  expect(autoprefixer().info({ from })).toMatch(/Browsers:\s+IE: 10/)
})

it('ignores unknown versions on request', () => {
  expect(() => {
    autoprefixer({ browsers: ['ie 100'] }).info()
  }).toThrowError()
  expect(() => {
    autoprefixer({
      browsers: ['ie 100'], ignoreUnknownVersions: true
    }).info()
  }).not.toThrowError()
})

describe('hacks', () => {
  it('ignores prefix IE filter', () => check('filter'))
  it('supports webkit filters', () => check('advanced-filter'))
  it('changes border image syntax', () => check('border-image'))
  it('supports old Mozilla prefixes', () => check('border-radius'))
  it('supports all flexbox syntaxes', () => check('flexbox'))
  it('supports map flexbox props', () => check('flex-rewrite'))
  it('supports all fullscreens', () => check('fullscreen'))
  it('supports custom prefixes', () => check('custom-prefix'))
  it('fixes break properties', () => check('multicolumn'))
  it('ignores some 3D transforms', () => check('3d-transform'))
  it('supports background-size', () => check('background-size'))
  it('supports background-clip', () => check('background-clip'))
  it('supports logical properties', () => check('logical'))
  it('supports appearance', () => check('appearance'))
  it('supports all placeholders', () => check('placeholder'))
  it('supports image-rendering', () => check('image-rendering'))
  it('supports border-box mask', () => check('mask-border'))
  it('supports image-set()', () => check('image-set'))
  it('supports writing-mode', () => check('writing-mode'))
  it('supports cross-fade()', () => check('cross-fade'))
  it('supports text-decoration', () => check('text-decoration'))
  it('ignores modern direction', () => check('animation'))
  it('supports overscroll-behavior', () => check('overscroll-behavior'))
  it('supports color-adjust', () => check('color-adjust'))

  it('supports appearance for IE', () => {
    const instance = autoprefixer({ browsers: 'Edge 15' })
    const result = postcss([instance]).process('a { appearance: none }')
    expect(result.css).toEqual(
      'a { -webkit-appearance: none; appearance: none }')
  })

  it('changes angle in gradient', () => {
    const input = read('gradient')
    const output = read('gradient.out')
    const result = postcss([prefixer('gradient')]).process(input)

    expect(result.css).toEqual(output)
    expect(result.warnings().map(i => i.toString())).toEqual([
      'autoprefixer: <css input>:18:5: Gradient has outdated direction ' +
            'syntax. New syntax is like `closest-side at 0 0` instead of ' +
            '`0 0, closest-side`.',
      'autoprefixer: <css input>:38:5: Gradient has outdated direction ' +
            'syntax. New syntax is like `to left` instead of `right`.',
      'autoprefixer: <css input>:100:5: Gradient has outdated ' +
            'direction syntax. Replace `cover` to `farthest-corner`.',
      'autoprefixer: <css input>:104:5: Gradient has outdated ' +
            'direction syntax. Replace `contain` to `closest-side`.'
    ])
  })

  it('warns on old flexbox display', () => {
    const result = postcss([flexboxer]).process('a{ display: box; }')
    expect(result.css).toEqual('a{ display: box; }')
    expect(result.warnings().map(i => i.toString())).toEqual([
      'autoprefixer: <css input>:1:4: You should write display: flex ' +
            'by final spec instead of display: box'
    ])
  })

  it('supports intrinsic sizing', () => {
    const input = read('intrinsic')
    const output = read('intrinsic.out')
    const result = postcss([prefixer('intrinsic')]).process(input)

    expect(result.css).toEqual(output)
    expect(result.warnings().map(i => i.toString())).toEqual([
      'autoprefixer: <css input>:15:5: Replace fill to stretch, ' +
            'because spec had been changed',
      'autoprefixer: <css input>:19:5: Replace fill-available ' +
            'to stretch, because spec had been changed'
    ])
  })

  it('supports text-emphasis', () => {
    const input = read('text-emphasis-position')
    const output = read('text-emphasis-position.out')
    const instance = prefixer('text-emphasis-position')
    const result = postcss([instance]).process(input)

    expect(result.css).toEqual(output)
    expect(result.warnings().map(i => i.toString())).toEqual([
      'autoprefixer: <css input>:14:5: You should use 2 values ' +
            'for text-emphasis-position For example, `under left` ' +
            'instead of just `under`.'
    ])
  })

  it('supports grid layout', () => {
    const input = read('grid')
    const output = read('grid.out')
    const instance = prefixer('grid')
    const result = postcss([instance]).process(input)

    expect(result.css).toEqual(output)
    expect(result.warnings().map(i => i.toString())).toEqual([
      'autoprefixer: <css input>:36:5: Can not prefix grid-column-end ' +
                '(grid-column-start is not found)',
      'autoprefixer: <css input>:39:5: Can not impliment grid-gap ' +
                'without grid-tamplate-columns',
      'autoprefixer: <css input>:39:5: Can not find grid areas: ' +
                'head, nav, main, foot',
      'autoprefixer: <css input>:47:5: Can not impliment grid-gap ' +
                'without grid-tamplate-columns',
      'autoprefixer: <css input>:47:5: Can not find grid areas: a',
      'autoprefixer: <css input>:55:5: Can not impliment grid-gap ' +
                'without grid-tamplate-columns',
      'autoprefixer: <css input>:55:5: Can not find grid areas: b',
      'autoprefixer: <css input>:63:5: Can not find grid areas: c',
      'autoprefixer: <css input>:71:5: Can not find grid areas: d',
      'autoprefixer: <css input>:99:5: grid-column-span is not part ' +
                'of final Grid Layout. Use grid-column.',
      'autoprefixer: <css input>:100:5: grid-row-span is not part ' +
                'of final Grid Layout. Use grid-row.',
      'autoprefixer: <css input>:101:5: grid-auto-columns is not ' +
                'supported by IE',
      'autoprefixer: <css input>:102:5: grid-auto-rows is not ' +
                'supported by IE',
      'autoprefixer: <css input>:103:5: grid-auto-flow is not ' +
                'supported by IE',
      'autoprefixer: <css input>:104:35: auto-fill value is not ' +
                'supported by IE',
      'autoprefixer: <css input>:105:32: auto-fit value is not ' +
                'supported by IE'
    ])
  })

  it('shows Grid warnings only for IE', () => {
    const input = 'a { grid-template-rows: repeat(auto-fit, 1px) }'
    const instance = autoprefixer({ browsers: 'chrome 27', grid: true })
    const result = postcss([instance]).process(input)
    expect(result.warnings()).toEqual([])
  })

  it('ignores values for CSS3PIE props', () => {
    const css = read('pie')
    expect(postcss([compiler]).process(css).css).toEqual(css)
  })

  it('add prefix for backface-visibility for Safari 9', () => {
    const input = 'a{ ' +
                      'backface-visibility: hidden; ' +
                      'transform-style: preserve-3d }'
    const ap = autoprefixer({ browsers: ['Safari 9'], flexbox: false })
    expect(postcss([ap]).process(input).css).toEqual(
      'a{ ' +
            '-webkit-backface-visibility: hidden; ' +
            'backface-visibility: hidden; ' +
            'transform-style: preserve-3d }'
    )
  })
})
