# DEEL Test questions

#### 1. What is the difference between Component and PureComponent? Give an example where it might break my app.
Component re-renders occur if the parent component re-renders. A PureComponent re-renders only if the passed props or component state change. In the latest version of React, you can use 'memo' to achieve what PureComponent does. In older versions, you should extend from PureComponent.

For example, you might have a large amount of data displayed in a table, and every 5 seconds, you need to update some rows in this table. Instead of updating the entire table, you can update only the necessary fields.

#### 2. Context + ShouldComponentUpdate might be dangerous. Why is that?
Context and ShouldComponentUpdate are not working together. I mean if Context changes, ShouldComponentUpdate will not fire. Context forcing to update all components.

#### 3. Describe 3 ways to pass information from a component to its PARENT.
 - Context
 - Callbacks
 - I don't know

#### 4. Give 2 ways to prevent components from re-rendering.
- memo (or shouldComponentUpdate for older versions)
- Optimise props and state

#### 5. What is a fragment and why do we need it? Give an example where it might break my app.
Fragment component or <></> can be used to group several components without using wrappers. If you using <></> instead of <Fragment> you should remember that <></> not accepting key property. If you need to use key - use <Fragment>. There is another issue with state and render, but I'm not remember exactly.

#### 6. Give 3 examples of the HOC pattern.
HOC - component that accept other component as prop.
- Any component that accepts children
- UI components (input with adornments)
- Context

#### 7. What's the difference in handling exceptions in promises, callbacks and async...await?
In async...await you should use try {} catch (e) {} finally {} on the other side in callbacks you should use chaining (.then().then().catch())

#### 8. How many arguments does setState take and why is it async.
setState takes two arguments:
1. value to set, or callback (prevState) => state
2. callback executed after state settled.
setState is async function to prevent unexpected rerender

#### 9. List the steps needed to migrate a Class to Function Component.
It's complicated question depends on how your current class component organized. Common case:
1. Replace class definition with a function
2. Remove super()
3. Replace all this.state this.setState with useState hook.
4. Replace this.props with props, context with useContext. 
5. Replace all class lifecycle methods (didMount, didUpdate etc.) with useEffect, useMemo, useCallback etc.
6. etc

#### 10. List a few ways styles can be used with components.
- Styled-components
- style attr
- CSS files and libraries

#### 11. How to render an HTML string coming from the server.
Use the dangerouslySetInnerHTML attr. But it can case some vulnerabilities.
