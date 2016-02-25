import type { Identifier, Element } from './types'

import React from 'react'
import getElement from './getElement'
import elementStyles from './styles'
import elementProps from './props'
import stringifyObjects from './stringifyObjects'

/*

  Shim around React.createElement, that adds in our:

     - tag helpers (sync, yield, repeat, if, ...)
     - styling (radium, css classes, ...)
     - object to string

*/

const DIV = 'div'

export default function createElement(identifier : Identifier, _props, ...args) {
  // TODO remove or document
  if (_props && _props.__skipMotion)
    return React.createElement(identifier[1], _props, ...args)

  const view = this
  const Motion = view.Motion || root.exports.Motion

  const el: Element = getElement(Motion, identifier, view, _props)
  const props = elementProps(Motion, el, view, _props)
  props.style = elementStyles(Motion, el, view, props)

  // TODO option to disable object stringifying
  if (!process.env.production)
    args = stringifyObjects(el, args, view)

  console.log('lets see it', el, props)

  const tag = props.tagName || (el.blacklisted ? DIV : el.component || el.name)

  console.log('creating', tag, props, args)
  return React.createElement(tag, props, ...args)
}