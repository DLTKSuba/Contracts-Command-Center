import { useEffect, useState } from 'react'
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import { Accordion } from './components/harmony/Accordion'
import { Alert } from './components/harmony/Alert'
import { Avatar } from './components/harmony/Avatar'
import { Badge } from './components/harmony/Badge'
import { Button } from './components/harmony/Button'
import { ButtonGroup } from './components/harmony/ButtonGroup'
import { Card } from './components/harmony/Card'
import { Checkbox } from './components/harmony/Checkbox'
import { CheckboxGroup } from './components/harmony/CheckboxGroup'
import { Chip } from './components/harmony/Chip'
import { DateInput } from './components/harmony/DateInput'
import { DatePicker } from './components/harmony/DatePicker'
import { DateTimePicker } from './components/harmony/DateTimePicker'
import { Dialog } from './components/harmony/Dialog'
import { Dropdown } from './components/harmony/Dropdown'
import { FloatingNav } from './components/harmony/FloatingNav'
import iconManifest from '@harmony-data/icon-manifest.json'
import { Icon, FALLBACK_ICON_NAMES } from './components/harmony/Icon'
import { Input } from './components/harmony/Input'
import { Kanban } from './components/harmony/Kanban'
import { KanbanCard } from './components/harmony/KanbanCard'
import { KanbanCardCostpoint } from './components/harmony/KanbanCardCostpoint'
import { Label } from './components/harmony/Label'
import { LeftSidebar } from './components/harmony/LeftSidebar'
import { Link } from './components/harmony/Link'
import { ListMenu } from './components/harmony/ListMenu'
import { MonthPicker } from './components/harmony/MonthPicker'
import { NotificationBadge } from './components/harmony/NotificationBadge'
import { NumberInput } from './components/harmony/NumberInput'
import { PickerPopup } from './components/harmony/PickerPopup'
import { ProgressBar } from './components/harmony/ProgressBar'
import { RadioButton } from './components/harmony/RadioButton'
import { RadioGroup } from './components/harmony/RadioGroup'
import { RangeInput } from './components/harmony/RangeInput'
import { RightSidebar } from './components/harmony/RightSidebar'
import { ShellFooter } from './components/harmony/ShellFooter'
import { ShellHeader } from './components/harmony/ShellHeader'
import { ShellLayout } from './components/harmony/ShellLayout'
import { ShellPageHeader } from './components/harmony/ShellPageHeader'
import { ShellPanel } from './components/harmony/ShellPanel'
import { Spinner } from './components/harmony/Spinner'
import { Step } from './components/harmony/Step'
import { Stepper } from './components/harmony/Stepper'
import { Table } from './components/harmony/Table'
import { CommandCenterPanel } from './components/harmony/CommandCenterPanel'
import { CommandCenterPanelSection } from './components/harmony/CommandCenterPanelSection'
import { TabStrip } from './components/harmony/TabStrip'
import { Textarea } from './components/harmony/Textarea'
import { TimePicker } from './components/harmony/TimePicker'
import { Toggle } from './components/harmony/Toggle'
import { Tooltip } from './components/harmony/Tooltip'
import { WeekPicker } from './components/harmony/WeekPicker'
import type { KanbanViewCardField } from './types/kanban-view-config'

export interface ComponentRegistryEntry {
  name: string
  Component: ComponentType<Record<string, unknown>>
  demoProps?: Record<string, ReactNode | unknown>
  fullPage?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>

/** Demo wrapper to show Button variants: theme (primary, secondary, etc.) vs page header */
function ButtonDemo() {
  const row = (label: string, buttons: React.ReactNode) => (
    <div key={label} style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>{buttons}</div>
    </div>
  )
  return (
    <>
      {row('Theme', <>
        <Button buttonType="theme" variant="primary">Primary</Button>
        <Button buttonType="theme" variant="secondary">Secondary</Button>
        <Button buttonType="theme" variant="tertiary">Tertiary</Button>
        <Button buttonType="theme" variant="outline">Outline</Button>
      </>)}
      {row('Page header', <>
        <Button buttonType="pageHeader" variant="primary">Primary</Button>
        <Button buttonType="pageHeader" variant="secondary">Secondary</Button>
      </>)}
      {row('Vertical orientation (theme)', <>
        <Button variant="primary" orientation="vertical" icon="arrow-up">Up</Button>
        <Button variant="secondary" orientation="vertical" icon="arrow-down">Down</Button>
        <Button variant="tertiary" orientation="vertical" icon="arrow-left">Left</Button>
        <Button variant="outline" orientation="vertical" icon="arrow-right">Right</Button>
      </>)}
      {row('Vertical orientation (page header)', <>
        <Button buttonType="pageHeader" variant="primary" orientation="vertical" icon="arrow-up">Up</Button>
        <Button buttonType="pageHeader" variant="secondary" orientation="vertical" icon="arrow-down">Down</Button>
        <Button buttonType="pageHeader" variant="tertiary" orientation="vertical" icon="arrow-left">Left</Button>
        <Button buttonType="pageHeader" variant="outline" orientation="vertical" icon="arrow-right">Right</Button>
      </>)}
    </>
  )
}

const AVATAR_DEMO_PHOTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=128&h=128&fit=crop&q=80'

/** Avatar: sizes, variants, interactive */
function AvatarDemo() {
  const row = (label: string, content: ReactNode, gap = '0.75rem') => (
    <div key={label} style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap, alignItems: 'flex-start' }}>{content}</div>
    </div>
  )
  const demoCol = (caption: string, node: ReactNode) => (
    <div
      key={caption}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {node}
      <span style={{ fontSize: '0.75rem', color: '#666' }}>{caption}</span>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {row('Sizes (icon)', <>
        <Avatar size="sm" />
        <Avatar size="md" />
        <Avatar size="lg" />
      </>)}
      {row('Variants', <>
        <Avatar size="md" variant="icon" />
        <Avatar size="md" variant="initials" initials="Jane Doe" />
        <Avatar
          size="md"
          variant="image"
          src={AVATAR_DEMO_PHOTO}
          alt="Portrait of a person used as sample photo"
        />
      </>)}
      {row('Interactive', <>
        {demoCol('Default', <Avatar size="md" interactive />)}
        {demoCol('Hover (demo)', <Avatar size="md" interactive className="avatar--demo-hover" />)}
        {demoCol('Focus (demo)', <Avatar size="md" interactive className="avatar--demo-focus" />)}
        {demoCol('Disabled', <Avatar size="md" interactive disabled />)}
      </>, '1.5rem')}
    </div>
  )
}

/** Input: label, leading/trailing icons, trailing action slot */
function InputDemo() {
  const row = (label: string, content: ReactNode) => (
    <div key={label} style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ maxWidth: '24rem' }}>{content}</div>
    </div>
  )
  const trailingBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--text-muted)',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {row('With label', <Input id="demo-input-lbl" label="Label" placeholder="Placeholder" />)}
      {row('Leading icon', <Input id="demo-input-li" icon="magnifying-glass" placeholder="Search..." />)}
      {row('Trailing icon', <Input id="demo-input-ti" trailingIcon="arrow-right" placeholder="Next step" />)}
      {row('Leading + trailing icons', <Input id="demo-input-both" icon="magnifying-glass" trailingIcon="x-mark" placeholder="Search" />)}
      {row('Trailing action', (
        <Input
          id="demo-input-ta"
          type="password"
          placeholder="Password"
          trailing={
            <button type="button" aria-label="Toggle password visibility" style={trailingBtnStyle}>
              <Icon name="eye" size="sm" />
            </button>
          }
        />
      ))}
    </div>
  )
}

/** Demo wrapper to show Checkbox checked and unchecked states (both toggleable) */
function CheckboxDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
    </div>
  )
}

/** Demo wrapper: default toggle plus segmented (static and controlled) */
function ToggleDemo() {
  const [segmented, setSegmented] = useState(false)
  const row = (label: string, content: React.ReactNode) => (
    <div key={label} style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>{content}</div>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {row('Default', <>
        <Toggle id="demo-toggle-default" label="Notifications" />
        <Toggle id="demo-toggle-on" label="On" defaultChecked />
      </>)}
      {row('Segmented (static)', <>
        <Toggle variant="segmented" id="demo-seg-a" />
        <Toggle variant="segmented" id="demo-seg-b" defaultChecked />
      </>)}
      {row('Segmented (controlled)', <>
        <Toggle
          variant="segmented"
          id="demo-seg-controlled"
          checked={segmented}
          onChange={(e) => setSegmented(e.target.checked)}
        />
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {segmented ? 'Right option' : 'Left option'}
        </span>
      </>)}
    </div>
  )
}

/** Demo wrapper to show Link size variants and optional muted/external */
function LinkDemo() {
  const row = (label: string, content: React.ReactNode) => (
    <div key={label} style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>{content}</div>
    </div>
  )
  return (
    <>
      {row('Size variants', <>
        <Link href="#" size="small">Small</Link>
        <Link href="#" size="medium">Medium</Link>
        <Link href="#" size="large">Large</Link>
      </>)}
      {row('Muted', <Link href="#" muted>Muted link</Link>)}
      {row('External', <Link href="https://example.com" external>External link</Link>)}
    </>
  )
}

/** Demo wrapper to show Badge size variants and with icons */
function BadgeDemo() {
  const row = (label: string, content: React.ReactNode) => (
    <div key={label} style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>{content}</div>
    </div>
  )
  return (
    <>
      {row('Sizes', <>
        <Badge variant="default" size="small">Small</Badge>
        <Badge variant="default" size="medium">Medium</Badge>
        <Badge variant="default" size="large">Large</Badge>
      </>)}
      {row('With Icons', <>
        <Badge variant="success" size="small" icon="check">Small</Badge>
        <Badge variant="success" size="medium" icon="check">Medium</Badge>
        <Badge variant="success" size="large" icon="check">Large</Badge>
      </>)}
    </>
  )
}

/** Demo wrapper to show ButtonGroup with text-only, icon+text, and icon-only at all sizes */
function ButtonGroupDemo() {
  const row = (label: string, content: React.ReactNode) => (
    <div key={label} style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>{content}</div>
    </div>
  )
  return (
    <>
      {row('Text only', (
        <ButtonGroup variant="default" size="md">
          <Button key="1" buttonType="theme" variant="primary">Option 1</Button>
          <Button key="2" buttonType="theme" variant="outline">Option 2</Button>
          <Button key="3" buttonType="theme" variant="outline">Option 3</Button>
        </ButtonGroup>
      ))}
      {row('With icons and text', (
        <ButtonGroup variant="default" size="md">
          <Button key="1" buttonType="theme" variant="primary" icon="plus">Button 1</Button>
          <Button key="2" buttonType="theme" variant="outline" icon="squares-2x2">Button 2</Button>
          <Button key="3" buttonType="theme" variant="outline" icon="chart-bar">Button 3</Button>
        </ButtonGroup>
      ))}
      {row('With icons and text – sizes', (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Small</span>
            <ButtonGroup variant="default" size="sm">
              <Button key="1" buttonType="theme" variant="primary" icon="plus">Button 1</Button>
              <Button key="2" buttonType="theme" variant="outline" icon="squares-2x2">Button 2</Button>
              <Button key="3" buttonType="theme" variant="outline" icon="chart-bar">Button 3</Button>
            </ButtonGroup>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Medium</span>
            <ButtonGroup variant="default" size="md">
              <Button key="1" buttonType="theme" variant="primary" icon="plus">Button 1</Button>
              <Button key="2" buttonType="theme" variant="outline" icon="squares-2x2">Button 2</Button>
              <Button key="3" buttonType="theme" variant="outline" icon="chart-bar">Button 3</Button>
            </ButtonGroup>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Large</span>
            <ButtonGroup variant="default" size="lg">
              <Button key="1" buttonType="theme" variant="primary" icon="plus">Button 1</Button>
              <Button key="2" buttonType="theme" variant="outline" icon="squares-2x2">Button 2</Button>
              <Button key="3" buttonType="theme" variant="outline" icon="chart-bar">Button 3</Button>
            </ButtonGroup>
          </div>
        </>
      ))}
      {row('Icon-only', (
        <ButtonGroup variant="default" size="md">
          <Button key="1" buttonType="theme" variant="primary" icon="plus" className="btn--icon-md" ariaLabel="Add" />
          <Button key="2" buttonType="theme" variant="outline" icon="squares-2x2" className="btn--icon-md" ariaLabel="Layers" />
          <Button key="3" buttonType="theme" variant="outline" icon="chart-bar" className="btn--icon-md" ariaLabel="Chart" />
        </ButtonGroup>
      ))}
    </>
  )
}

/** Demo wrapper to show RadioButton states, size variants, and validation states */
function RadioButtonDemo() {
  const row = (label: string, content: React.ReactNode) => (
    <div key={label} style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>{content}</div>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {row('States', <>
        <RadioButton name="demo-states" value="1" label="Unchecked" />
        <RadioButton name="demo-states" value="2" label="Checked" defaultChecked />
        <RadioButton name="demo-states-disabled" value="3" label="Disabled" disabled />
        <RadioButton name="demo-states-disabled" value="4" label="Checked & Disabled" defaultChecked disabled />
      </>)}
      {row('Size variants', <>
        <RadioButton name="demo-sizes" value="sm" label="Small" size="small" />
        <RadioButton name="demo-sizes" value="md" label="Medium (default)" size="medium" defaultChecked />
        <RadioButton name="demo-sizes" value="lg" label="Large" size="large" />
      </>)}
      {row('Warning states', <>
        <RadioButton name="demo-warn-1" value="1" label="Unchecked with warning" warning warningMessage="This action may have unintended consequences" />
        <RadioButton name="demo-warn-2" value="2" label="Checked with warning" defaultChecked warning warningMessage="Review this selection carefully" />
      </>)}
      {row('Error states', <>
        <RadioButton name="demo-err-1" value="1" label="Unchecked with error" error errorMessage="This field is required" />
        <RadioButton name="demo-err-2" value="2" label="Checked with error" defaultChecked error errorMessage="This selection is invalid" />
      </>)}
    </div>
  )
}

/** Demo wrapper showing basic, with-header, with-icons, and single-icon Card variants */
function CardDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '480px' }}>
      <Card>
        Basic card — no header, just a container with body content.
      </Card>
      <Card withHeader headerTitle="Card with Header" headerSubtitle="Optional subtitle">
        Card body content with a header section above.
      </Card>
      <Card withHeader headerTitle="Card with Icons" headerSubtitle="Header icons are optional" icon1="x-mark" icon2="ellipsis-vertical" icon3="cog-6-tooth">
        Card body content with a header and all three icon buttons.
      </Card>
      <Card withHeader headerTitle="Single Icon" icon1="x-mark">
        A single icon always appears at the far right.
      </Card>

      <Card primary>
        Primary border card — no header, just a container with body content.
      </Card>
      <Card primary withHeader headerTitle="Primary Border Card with Header" headerSubtitle="Optional subtitle">
      Card body content with a header section above.
      </Card>
      <Card primary withHeader headerTitle="Primary Border Card with Icons" headerSubtitle="Header icons are optional" icon1="x-mark" icon2="ellipsis-vertical" icon3="cog-6-tooth">
      Card body content with a header and all three icon buttons.
      </Card>
      <Card primary withHeader headerTitle="Primary Border Card with Single Icon" icon1="x-mark">
        A single icon always appears at the far right.
      </Card>

    </div>
  )
}

const dialogSectionTitleStyle: React.CSSProperties = { fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }
const dialogSectionDescStyle: React.CSSProperties = { fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }
const dialogSectionGap: React.CSSProperties = { marginBottom: '1.5rem' }

/** Default and enhanced-with-actions (buttons + link on one row) */
function AlertDemo() {
  const section = (title: string, desc: string, node: ReactNode) => (
    <div key={title} style={dialogSectionGap}>
      <div style={dialogSectionTitleStyle}>{title}</div>
      <div style={dialogSectionDescStyle}>{desc}</div>
      <div style={{ maxWidth: '36rem' }}>{node}</div>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {section('Default', 'Standard info alert.', <Alert variant="info">This is an info alert.</Alert>)}
      {section(
        'Enhanced with actions',
        'Primary and secondary buttons with a link on the same row.',
        <Alert
          variant="success"
          style="enhanced"
          title="Success Alert"
          primaryButton={{ text: 'Button Text' }}
          secondaryButton={{ text: 'Button Text' }}
          linkText="Link Text"
          linkHref="#"
          dismissible
        >
          This alert includes primary and secondary buttons, plus a link.
        </Alert>,
      )}
    </div>
  )
}

/** Accordion gallery: basic, label, allowMultiple, defaultOpen, disabled */
function AccordionDemo() {
  const basicItems = [
    { title: 'First section', content: 'Content for the first panel.' },
    { title: 'Second section', content: 'Content for the second panel.' },
    { title: 'Third section', content: 'Content for the third panel.' },
  ]
  const defaultOpenItems = [
    { title: 'Closed by default', content: 'Expand to read.' },
    { title: 'Open by default', content: 'This section starts expanded.', defaultOpen: true },
  ]
  const labeledItems = [
    { title: 'Notifications', content: 'Choose how you receive updates.' },
    { title: 'Privacy', content: 'Control what data is stored.' },
  ]
  const disabledItems = [
    { title: 'Editable section', content: 'This section can be expanded.' },
    { title: 'Disabled section', content: 'This content is not available.', disabled: true },
    { title: 'Another section', content: 'Additional content here.' },
  ]
  const section = (title: string, desc: string, node: ReactNode) => (
    <div key={title} style={dialogSectionGap}>
      <div style={dialogSectionTitleStyle}>{title}</div>
      <div style={dialogSectionDescStyle}>{desc}</div>
      <div style={{ maxWidth: '36rem' }}>{node}</div>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {section('Basic', 'Single open section at a time (default).', <Accordion items={basicItems} />)}
      {section(
        'With label',
        'Optional label above the control; sets role="group" and aria-labelledby.',
        <Accordion label="Account preferences" items={labeledItems} />,
      )}
      {section(
        'Allow multiple',
        'Several sections can stay open at once.',
        <Accordion items={basicItems} allowMultiple />,
      )}
      {section(
        'Default open',
        'An item may set defaultOpen to start expanded.',
        <Accordion items={defaultOpenItems} />,
      )}
      {section(
        'With disabled section',
        'Disabled items cannot be expanded and are skipped in the tab order.',
        <Accordion items={disabledItems} allowMultiple />,
      )}
    </div>
  )
}

/** Multiple dialog examples showing all options: basic, tertiary button, primary header, right-aligned, confirmation, non-resizable, long content */
function DialogDemo() {
  const [openId, setOpenId] = useState<string | null>(null)
  const close = () => setOpenId(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={dialogSectionGap}>
        <div style={dialogSectionTitleStyle}>Basic</div>
        <div style={dialogSectionDescStyle}>Default dialog with Confirm and Cancel.</div>
        <Button buttonType="theme" variant="primary" onClick={() => setOpenId('basic')}>Open basic dialog</Button>
      </div>

      <div style={dialogSectionGap}>
        <div style={dialogSectionTitleStyle}>Three buttons (Yes, No, Cancel)</div>
        <div style={dialogSectionDescStyle}>Optional tertiary (link-style) button for a less prominent action.</div>
        <Button buttonType="theme" variant="primary" onClick={() => setOpenId('tertiary')}>Open save changes dialog</Button>
      </div>

      <div style={dialogSectionGap}>
        <div style={dialogSectionTitleStyle}>Primary header</div>
        <div style={dialogSectionDescStyle}>Header uses theme primary background with inverse text.</div>
        <Button buttonType="theme" variant="primary" onClick={() => setOpenId('primary-header')}>Open primary header dialog</Button>
      </div>

      <div style={dialogSectionGap}>
        <div style={dialogSectionTitleStyle}>Right-aligned buttons</div>
        <div style={dialogSectionDescStyle}>Footer buttons aligned to the right.</div>
        <Button buttonType="theme" variant="primary" onClick={() => setOpenId('right-align')}>Open right-aligned dialog</Button>
      </div>

      <div style={dialogSectionGap}>
        <div style={dialogSectionTitleStyle}>Confirmation (custom footer)</div>
        <div style={dialogSectionDescStyle}>Custom footer with destructive action and Cancel.</div>
        <Button buttonType="theme" variant="destructive" onClick={() => setOpenId('confirm')}>Delete item</Button>
      </div>

      <div style={dialogSectionGap}>
        <div style={dialogSectionTitleStyle}>Non-resizable</div>
        <div style={dialogSectionDescStyle}>Resize grip hidden when resizable=false.</div>
        <Button buttonType="theme" variant="primary" onClick={() => setOpenId('non-resizable')}>Open non-resizable dialog</Button>
      </div>

      <div style={dialogSectionGap}>
        <div style={dialogSectionTitleStyle}>Long content (scrollable body)</div>
        <div style={dialogSectionDescStyle}>Body overflows and scrolls; header and footer stay fixed.</div>
        <Button buttonType="theme" variant="primary" onClick={() => setOpenId('scrollable')}>Open scrollable dialog</Button>
      </div>

      <Dialog id="demo-dialog-basic" title="Dialog" open={openId === 'basic'} onClose={close}>
        Dialog body content. Confirm and Cancel use the default footer.
      </Dialog>

      <Dialog
        id="demo-dialog-tertiary"
        title="Save changes?"
        open={openId === 'tertiary'}
        onClose={close}
        tertiaryLabel="Cancel"
      >
        <p style={{ margin: 0 }}>Do you want to save your changes before closing? Yes saves and closes, No closes without saving, Cancel keeps the dialog open.</p>
      </Dialog>

      <Dialog
        id="demo-dialog-primary"
        title="Primary header"
        headerVariant="primary"
        open={openId === 'primary-header'}
        onClose={close}
      >
        <p style={{ margin: 0 }}>This dialog has a primary-colored header with inverse text.</p>
      </Dialog>

      <Dialog
        id="demo-dialog-right"
        title="Right-aligned buttons"
        buttonAlignment="right"
        open={openId === 'right-align'}
        onClose={close}
      >
        <p style={{ margin: 0 }}>Footer buttons are aligned to the right.</p>
      </Dialog>

      <Dialog
        id="demo-dialog-confirm"
        title="Delete item?"
        open={openId === 'confirm'}
        onClose={close}
        footer={
          <div className="dialog__footer-actions">
            <Button buttonType="theme" variant="destructive" onClick={close}>Delete</Button>
            <Button buttonType="theme" variant="secondary" onClick={close}>Cancel</Button>
          </div>
        }
      >
        <p style={{ margin: 0 }}>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Dialog>

      <Dialog
        id="demo-dialog-nonresize"
        title="Non-resizable"
        resizable={false}
        open={openId === 'non-resizable'}
        onClose={close}
      >
        <p style={{ margin: 0 }}>This dialog has no resize grip in the corner.</p>
      </Dialog>

      <Dialog
        id="demo-dialog-scrollable"
        title="Scrollable Body"
        className="dialog--scrollable-demo"
        open={openId === 'scrollable'}
        onClose={close}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0 }}>When content is long, only the body scrolls. The header and footer stay fixed.</p>
          <p style={{ margin: 0 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p style={{ margin: 0 }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
          <p style={{ margin: 0 }}>Cras mattis consectetur purus sit amet fermentum. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
          <p style={{ margin: 0 }}>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
          <p style={{ margin: 0 }}>Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
          <p style={{ margin: 0 }}>Etiam porta sem malesuada magna mollis euismod. Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p>
          <p style={{ margin: 0 }}>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam quis risus eget urna mollis ornare vel eu leo.</p>
          <p style={{ margin: 0 }}>Scroll to see that the header and footer remain fixed at the top and bottom.</p>
        </div>
      </Dialog>
    </div>
  )
}

/** Demo wrapper so PickerPopup is in a positioned container and shows a DatePicker inside (correct usage) */
function PickerPopupDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div id="demo-picker-trigger" style={{ position: 'relative', minHeight: '60px' }} className="date-input-wrapper">
      <Button
        buttonType="theme"
        variant="primary"
        onClick={() => setOpen(true)}
      >
        Open picker
      </Button>
      <PickerPopup
        id="demo-picker-popup"
        triggerId="demo-picker-trigger"
        open={open}
        onClose={() => setOpen(false)}
        title="Choose date"
      >
        <DatePicker
          id="demo-popup-date-picker"
          onDateSelect={() => setOpen(false)}
        />
      </PickerPopup>
    </div>
  )
}

/* Shared table data for TableDemo variants */
const projectHeader = (
  <thead>
    <tr>
      <th className="text-left" scope="col">Project ID</th>
      <th className="text-left" scope="col">Name</th>
      <th className="text-left" scope="col">Status</th>
      <th className="text-right" scope="col">Budget</th>
    </tr>
  </thead>
)

const projectBodyGray = (
  <tbody>
    <tr><td>PRJ-001</td><td>Website Redesign</td><td><Badge variant="success">Active</Badge></td><td className="text-right">$25,000</td></tr>
    <tr><td>PRJ-002</td><td>Mobile App Development</td><td><Badge variant="warning">In Progress</Badge></td><td className="text-right">$150,000</td></tr>
    <tr><td>PRJ-003</td><td>Database Migration</td><td><Badge variant="default">Pending</Badge></td><td className="text-right">$45,000</td></tr>
    <tr><td>PRJ-004</td><td>Security Audit</td><td><Badge variant="info">Review</Badge></td><td className="text-right">$12,500</td></tr>
  </tbody>
)

const projectBodyShort = (
  <tbody>
    <tr><td>PRJ-001</td><td>Website Redesign</td><td><Badge variant="success">Active</Badge></td><td className="text-right">$25,000</td></tr>
    <tr><td>PRJ-002</td><td>Mobile App Development</td><td><Badge variant="warning">In Progress</Badge></td><td className="text-right">$150,000</td></tr>
  </tbody>
)

const periodOptions = [
  { value: 'all', label: 'All periods' },
  { value: 'q1-2025', label: 'Q1 2025' },
  { value: 'q2-2025', label: 'Q2 2025' },
  { value: 'q3-2025', label: 'Q3 2025' },
]
const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
]

const sectionTitleStyle: React.CSSProperties = { fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }
const sectionDescStyle: React.CSSProperties = { fontSize: '0.875rem', color: '#666', marginBottom: '0.75rem' }
const sectionGap = { marginBottom: '2rem' }
const overflowWrap = { overflowX: 'auto' as const }

function TabStripDemo() {
  const baseTabs = [
    { id: 'tab-1', label: 'Tab 1', active: true },
    { id: 'tab-2', label: 'Tab 2' },
  ]
  const pillTabs = [
    { id: 'p1', label: 'Overview', active: true },
    { id: 'p2', label: 'Transformation' },
    { id: 'p3', label: 'Validation' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={sectionTitleStyle}>Default</div>
        <p style={sectionDescStyle}>Underline selected tab (all themes).</p>
        <TabStrip tabs={baseTabs} />
      </div>
      <div className="ds-demo-only-theme-vp">
        <div style={sectionTitleStyle}>Pill (VP only)</div>
        <p style={sectionDescStyle}>
          Selected tab uses a filled pill instead of a thick bottom border. VP theme only.
        </p>
        <TabStrip tabs={pillTabs} variant="pill" />
      </div>
    </div>
  )
}

/** All table variants on one page, matching Astro tables docs. */
function TableDemo() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [period, setPeriod] = useState('all')
  const [status, setStatus] = useState('all')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [ccSelectedId, setCcSelectedId] = useState<string | null>('10215')
  const commandCenterParentRowIds = [
    '10105', '10160', '10215', '10340', '10475', '10625', '10720', '10855', '10910', '11002',
  ] as const
  const [ccExpandedGroupIds, setCcExpandedGroupIds] = useState<string[]>(['10215'])
  const ccCommandCenterRowLabel: Record<string, string> = {
    '10105': 'Metro Transit Program',
    '10105.01': 'Milestone 01',
    '10160': 'Coastal Resilience',
    '10160.01': 'Milestone 01',
    '10215': 'Urban Water Systems',
    '10215.01': 'Phase I — Site Assessment',
    '10215.02': 'Phase II — Remediation',
    '10340': 'Regional Power Grid',
    '10340.01': 'Milestone 01',
    '10475': 'Public Health Initiative',
    '10475.01': 'Milestone 01',
    '10625': 'Intl Nutrition Advocacy',
    '10625.01': 'Milestone 01',
    '10720': 'Green Building Standards',
    '10720.01': 'Milestone 01',
    '10855': 'Digital Services Platform',
    '10855.01': 'Milestone 01',
    '10910': 'Airport Modernization',
    '10910.01': 'Milestone 01',
    '11002': 'Highway Corridor Study',
    '11002.01': 'Milestone 01',
  }
  const [ccPanelOpen, setCcPanelOpen] = useState(true)
  const [ccSortKey, setCcSortKey] = useState('id')
  const [ccSortDir, setCcSortDir] = useState<'asc' | 'desc'>('asc')

  const interactiveRowIds = ['1', '2', '3'] as const
  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const selectAll = () => setSelectedRows(new Set(interactiveRowIds))
  const clearAll = () => setSelectedRows(new Set())

  const sortColumns = [
    { key: 'id', label: 'Project ID', align: 'left' as const },
    { key: 'name', label: 'Name', align: 'left' as const },
    { key: 'status', label: 'Status', align: 'left' as const },
    { key: 'budget', label: 'Budget', align: 'right' as const },
  ]
  const commandCenterSortColumns = [
    { key: 'id', label: 'Project ID', align: 'left' as const },
    { key: 'name', label: 'Project Name', align: 'left' as const },
    { key: 'funded', label: 'Total Funded Amt', align: 'right' as const },
    { key: 'revenue', label: 'ITD Revenue Amt', align: 'right' as const },
  ]
  const sortRows = [
    { id: 'PRJ-001', name: 'Website Redesign', status: 'Active', budget: '$25,000' },
    { id: 'PRJ-002', name: 'Mobile App Development', status: 'In Progress', budget: '$150,000' },
    { id: 'PRJ-003', name: 'Database Migration', status: 'Pending', budget: '$45,000' },
    { id: 'PRJ-004', name: 'Security Audit', status: 'Review', budget: '$12,500' },
  ]

  const filterBar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
      <Dropdown options={periodOptions} value={period} placeholder="Period" onChange={(v) => setPeriod(v)} />
      <Dropdown options={statusOptions} value={status} placeholder="Status" onChange={(v) => setStatus(v)} />
      <Button buttonType="theme" variant="ghost" size="sm" onClick={() => { setPeriod('all'); setStatus('all') }}>Clear</Button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {period !== 'all' && <Chip label={periodOptions.find((o) => o.value === period)?.label ?? period} removable onRemove={() => setPeriod('all')} />}
        {status !== 'all' && <Chip label={statusOptions.find((o) => o.value === status)?.label ?? status} removable onRemove={() => setStatus('all')} />}
      </div>
    </div>
  )

  const titleBarIcons = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <button type="button" className="table__title-bar-icon" aria-label="Help"><Icon name="question-mark-circle" size="sm" /></button>
      <button type="button" className="table__title-bar-icon" aria-label="Minimize"><Icon name="minimize" size="sm" /></button>
      <button type="button" className="table__title-bar-icon" aria-label="Window"><Icon name="window" size="sm" /></button>
      <button type="button" className="table__title-bar-icon" aria-label="Close"><Icon name="x-mark" size="sm" /></button>
    </div>
  )

  const actionBar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <Button buttonType="theme" variant="ghost" size="sm" icon="document-duplicate" iconPosition="right">Copy</Button>
      <Button buttonType="theme" variant="ghost" size="sm" icon="plus" iconPosition="right">Add</Button>
      <Button buttonType="theme" variant="ghost" size="sm" icon="trash">Delete</Button>
      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', padding: '0 var(--space-1)' }}>|</span>
      <Button buttonType="theme" variant="ghost" size="sm" icon="queue-list">Group</Button>
      <Button buttonType="theme" variant="ghost" size="sm" icon="cog-6-tooth">Customize Columns</Button>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--text-primary)', padding: 'var(--space-1) var(--space-2)' }}>All Filters</span>
    </div>
  )

  const avatarCell = (initials: string, name: string, email: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--theme-primary)' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-inverse)' }}>{initials}</span>
      </div>
      <div>
        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{email}</div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      {/* 1. Basic Table */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Basic Table</h2>
        <div style={{ ...sectionDescStyle, marginBottom: '1rem' }}>Default Table with Gray Header</div>
        <div style={overflowWrap}>
          <Table headerVariant="gray" header={projectHeader} body={projectBodyGray} />
        </div>
        <div style={{ ...sectionDescStyle, marginTop: '1.5rem', marginBottom: '1rem' }}>Table with White Header</div>
        <div style={overflowWrap}>
          <Table headerVariant="white" header={projectHeader} body={projectBodyShort} />
        </div>
      </div>

      {/* 2. Table with Actions */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Table with Actions</h2>
        <div style={sectionDescStyle}>The header checkbox selects or deselects all rows. Selected rows are highlighted in blue.</div>
        <div style={overflowWrap}>
          <Table
            headerVariant="gray"
            header={
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <Checkbox
                      name="select-all"
                      aria-label="Select all rows"
                      checked={selectedRows.size === interactiveRowIds.length}
                      onChange={() =>
                        selectedRows.size === interactiveRowIds.length
                          ? clearAll()
                          : selectAll()
                      }
                    />
                  </th>
                  <th className="text-left" scope="col">Employee</th>
                  <th className="text-left" scope="col">Department</th>
                  <th className="text-left" scope="col">Role</th>
                  <th className="text-right" scope="col">Actions</th>
                </tr>
              </thead>
            }
            body={
              <tbody>
                <tr className={selectedRows.has('1') ? 'table-row--selected' : undefined}>
                  <td><Checkbox name="select-1" aria-label="Select row for John Doe" checked={selectedRows.has('1')} onChange={() => toggleRow('1')} /></td>
                  <td>{avatarCell('JD', 'John Doe', 'john.doe@company.com')}</td>
                  <td>Engineering</td>
                  <td>Senior Developer</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
                <tr className={selectedRows.has('2') ? 'table-row--selected' : undefined}>
                  <td><Checkbox name="select-2" aria-label="Select row for Jane Smith" checked={selectedRows.has('2')} onChange={() => toggleRow('2')} /></td>
                  <td>{avatarCell('JS', 'Jane Smith', 'jane.smith@company.com')}</td>
                  <td>Design</td>
                  <td>UX Lead</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
                <tr className={selectedRows.has('3') ? 'table-row--selected' : undefined}>
                  <td><Checkbox name="select-3" aria-label="Select row for Mike Johnson" checked={selectedRows.has('3')} onChange={() => toggleRow('3')} /></td>
                  <td>{avatarCell('MJ', 'Mike Johnson', 'mike.j@company.com')}</td>
                  <td>Marketing</td>
                  <td>Manager</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
              </tbody>
            }
          />
        </div>
      </div>

      {/* 3. Table with Reorderable Rows */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Table with Reorderable Rows</h2>
        <div style={sectionDescStyle}>Drag the grip icon at the left of each row to reorder.</div>
        <div style={overflowWrap}>
          <Table
            headerVariant="gray"
            reorderable
            header={
              <thead>
                <tr>
                  <th className="table__grip-column" scope="col" aria-label="Reorder" />
                  <th className="text-left" scope="col">Project ID</th>
                  <th className="text-left" scope="col">Name</th>
                  <th className="text-left" scope="col">Status</th>
                  <th className="text-right" scope="col">Budget</th>
                </tr>
              </thead>
            }
            body={projectBodyGray}
          />
        </div>
      </div>

      {/* 3b. Table with Grouped Rows */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Table with Grouped Rows</h2>
        <div style={sectionDescStyle}>Expandable rows (those with child rows) display a small arrow icon on the far left. Click the arrow to expand or collapse child rows. Child rows are indented based on their depth.</div>
        <div style={overflowWrap}>
          <Table
            headerVariant="gray"
            grouped
            header={
              <thead>
                <tr>
                  <th className="table__expand-column" scope="col" aria-label="Expand" />
                  <th className="text-left" scope="col">Project ID</th>
                  <th className="text-left" scope="col">Name</th>
                  <th className="text-left" scope="col">Status</th>
                  <th className="text-right" scope="col">Budget</th>
                  <th className="text-right" scope="col">Actions</th>
                </tr>
              </thead>
            }
            body={
              <tbody>
                <tr data-row-id="r1" data-has-children={true}>
                  <td>PRJ-001</td>
                  <td>Website Redesign</td>
                  <td><Badge variant="success">Active</Badge></td>
                  <td className="text-right">$25,000</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
                <tr data-parent-id="r1" data-depth={1}>
                  <td>PRJ-001-A</td>
                  <td>Frontend Development</td>
                  <td><Badge variant="warning">In Progress</Badge></td>
                  <td className="text-right">$12,000</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
                <tr data-parent-id="r1" data-depth={1}>
                  <td>PRJ-001-B</td>
                  <td>Backend API</td>
                  <td><Badge variant="default">Pending</Badge></td>
                  <td className="text-right">$13,000</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
                <tr data-row-id="r2" data-has-children={true}>
                  <td>PRJ-002</td>
                  <td>Mobile App Development</td>
                  <td><Badge variant="warning">In Progress</Badge></td>
                  <td className="text-right">$150,000</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
                <tr data-parent-id="r2" data-depth={1}>
                  <td>PRJ-002-A</td>
                  <td>iOS Module</td>
                  <td><Badge variant="info">Review</Badge></td>
                  <td className="text-right">$75,000</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
                <tr data-row-id="r3">
                  <td>PRJ-003</td>
                  <td>Database Migration</td>
                  <td><Badge variant="default">Pending</Badge></td>
                  <td className="text-right">$45,000</td>
                  <td className="table-cell--actions">
                    <button type="button" className="icon-btn"><Icon name="ellipsis-vertical" size="md" className="icon-btn__icon" /></button>
                  </td>
                </tr>
              </tbody>
            }
          />
        </div>
      </div>

      {/* 4. Striped Table */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Striped Table</h2>
        <div style={sectionDescStyle}>Alternating row background colors. Total row uses blue highlight.</div>
        <div style={overflowWrap}>
          <Table
            headerVariant="gray"
            striped
            header={
              <thead>
                <tr>
                  <th className="text-left" scope="col">Code</th>
                  <th className="text-left" scope="col">Description</th>
                  <th className="text-right" scope="col">Amount</th>
                </tr>
              </thead>
            }
            body={
              <tbody>
                <tr><td className="font-mono">ACC-1001</td><td>Operating Expenses</td><td className="text-right">$12,450.00</td></tr>
                <tr><td className="font-mono">ACC-1002</td><td>Equipment Purchase</td><td className="text-right">$8,750.00</td></tr>
                <tr><td className="font-mono">ACC-1003</td><td>Travel & Entertainment</td><td className="text-right">$3,200.00</td></tr>
                <tr><td className="font-mono">ACC-1004</td><td>Software Licenses</td><td className="text-right">$15,600.00</td></tr>
                <tr className="table-row--total" style={{ fontWeight: 600 }}><td colSpan={2}>Total</td><td className="text-right">$40,000.00</td></tr>
              </tbody>
            }
          />
        </div>
      </div>

      {/* 5. Sortable column headers */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Sortable column headers</h2>
        <div style={sectionDescStyle}>Column headers can be sortable with icons indicating sort order.</div>
        <div style={overflowWrap}>
          <Table
            headerVariant="gray"
            striped
            sortColumns={sortColumns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={(key, dir) => { setSortColumn(key); setSortDirection(dir) }}
            body={
              <tbody>
                {sortRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td><Badge variant={row.status === 'Active' ? 'success' : row.status === 'In Progress' ? 'warning' : row.status === 'Pending' ? 'default' : 'info'}>{row.status}</Badge></td>
                    <td className="text-right">{row.budget}</td>
                  </tr>
                ))}
              </tbody>
            }
          />
        </div>
      </div>

      {/* 6. Title Bar and Action Bar */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Table with Title Bar and Action Bar</h2>
        <div style={{ ...sectionDescStyle, marginBottom: '1rem' }}>Table with Title Bar</div>
        <div style={overflowWrap}>
          <Table headerVariant="gray" titleBarContent={<h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-13)', fontWeight: 600, lineHeight: 'var(--leading-snug)', color: 'var(--text-primary)', margin: 0 }}>Table Title</h1>} titleBarIcons={titleBarIcons} header={projectHeader} body={projectBodyShort} />
        </div>
        <div style={{ ...sectionDescStyle, marginTop: '1.5rem', marginBottom: '1rem' }}>Table with Action Bar</div>
        <div style={overflowWrap}>
          <Table headerVariant="gray" actionBar={actionBar} header={projectHeader} body={projectBodyShort} />
        </div>
        <div style={{ ...sectionDescStyle, marginTop: '1.5rem', marginBottom: '1rem' }}>Table with Title Bar and Action Bar</div>
        <div style={overflowWrap}>
          <Table headerVariant="gray" titleBarContent={<h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-13)', fontWeight: 600, lineHeight: 'var(--leading-snug)', color: 'var(--text-primary)', margin: 0 }}>Table Title</h1>} titleBarIcons={titleBarIcons} actionBar={actionBar} header={projectHeader} body={projectBodyShort} />
        </div>
      </div>

      {/* 7. Table with Filter Bar */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Table with Filter Bar</h2>
        <div style={sectionDescStyle}>Filter bar with dropdowns, filter chips, and Clear button. All periods and All Statuses are defaults; chips appear only when filters are applied.</div>
        <div style={overflowWrap}>
          <Table headerVariant="gray" filterBar={filterBar} header={projectHeader} body={
            <tbody>
              <tr><td>PRJ-001</td><td>Website Redesign</td><td>Active</td><td className="text-right">$25,000</td></tr>
              <tr><td>PRJ-002</td><td>Mobile App Development</td><td>In Progress</td><td className="text-right">$150,000</td></tr>
              <tr><td>PRJ-003</td><td>Database Migration</td><td>Pending</td><td className="text-right">$45,000</td></tr>
            </tbody>
          } />
        </div>
      </div>

      {/* 8. Command Center table + panel */}
      <div style={sectionGap}>
        <h2 style={sectionTitleStyle}>Command Center</h2>
        <div style={sectionDescStyle}>
          Dense grid, sort and filter header affordances, border selection, a docked detail panel, and grouped rows: expand a parent in the Project ID column to show indented subrows (IDs <code>10215.01</code>, <code>10215.02</code>, and so on). Filter icons are wired to a no-op; implement <code>onFilterClick</code> in the app.
        </div>
        <div style={{ width: '100%', minWidth: 0, minHeight: 280, ...overflowWrap }}>
            <Table
              variant="commandCenter"
              grouped
              groupedExpandedRowIds={ccExpandedGroupIds}
              onGroupedExpandedRowIdsChange={setCcExpandedGroupIds}
              commandCenterToolbar={(
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', width: '100%' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => { setCcExpandedGroupIds([]) }}
                    >
                      Collapse All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => { setCcExpandedGroupIds([...commandCenterParentRowIds]) }}
                    >
                      Expand All
                    </Button>
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>As of 09/20/2024</span>
                </div>
              )}
              commandCenterAside={
                ccPanelOpen && ccSelectedId != null ? (
                  <CommandCenterPanel
                    title="Project Billing Details"
                    open
                    onClose={() => { setCcPanelOpen(false); setCcSelectedId(null) }}
                    visual={(
                      <div>
                        <a href="#demo" className="text-link" style={{ fontSize: 'var(--text-sm)' }} onClick={(e) => e.preventDefault()}>
                          {ccSelectedId} — {ccCommandCenterRowLabel[ccSelectedId] ?? 'Project'}
                        </a>
                        <div className="command-center-panel__meter" role="img" aria-label="Illustrative funding range from 0 to 120K">
                          <span className="command-center-panel__meter-line" aria-hidden="true" />
                        </div>
                        <div className="command-center-panel__meter-ticks" aria-hidden="true">
                          <span>$0K</span>
                          <span>$30K</span>
                          <span>$60K</span>
                          <span>$90K</span>
                          <span>$120K</span>
                        </div>
                      </div>
                    )}
                  >
                    <div className="command-center-panel__sections">
                      <CommandCenterPanelSection title="Financial Information" defaultOpen>
                        <table className="command-center-stat-table">
                          <thead>
                            <tr>
                              <th scope="col" />
                              <th scope="col">ITD</th>
                              <th scope="col">Pending</th>
                              <th scope="col">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="command-center-stat-table__label">Funding</td>
                              <td className="command-center-stat-table__num">$0.00</td>
                              <td className="command-center-stat-table__num">$0.00</td>
                              <td className="command-center-stat-table__num">$6,200,000.00</td>
                            </tr>
                            <tr>
                              <td className="command-center-stat-table__label">Revenue</td>
                              <td className="command-center-stat-table__num">
                                <a href="#demo" className="text-link" onClick={(e) => e.preventDefault()}>$920,000.00</a>
                              </td>
                              <td className="command-center-stat-table__num">$0.00</td>
                              <td className="command-center-stat-table__num">$920,000.00</td>
                            </tr>
                            <tr>
                              <td className="command-center-stat-table__label">Unbilled</td>
                              <td className="command-center-stat-table__num">$0.00</td>
                              <td className="command-center-stat-table__num">$0.00</td>
                              <td className="command-center-stat-table__num">$45,200.00</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="command-center-card">
                          <p className="command-center-card__label">Unbilled Analysis Update</p>
                          <p className="command-center-card__value">$45,200.00</p>
                        </div>
                      </CommandCenterPanelSection>
                      <CommandCenterPanelSection title="Billing Information" defaultOpen={false}>
                        <div className="command-center-card command-center-card--flush">
                          <p className="command-center-card__label">Customer(s)</p>
                          <p className="command-center-card__value" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                            <a href="#demo" className="text-link" onClick={(e) => e.preventDefault()}>Abc Industries</a>
                            <span>5%</span>
                          </p>
                        </div>
                        <div className="command-center-card-grid">
                          <div className="command-center-card">
                            <p className="command-center-card__label">Biller</p>
                            <p className="command-center-card__value">Michael Scott</p>
                          </div>
                          <div className="command-center-card">
                            <p className="command-center-card__label">Billing Cycle</p>
                            <p className="command-center-card__value">Progress</p>
                          </div>
                        </div>
                      </CommandCenterPanelSection>
                      <CommandCenterPanelSection title="Project Information" defaultOpen={false}>
                        <div className="command-center-card-grid">
                          <div className="command-center-card">
                            <p className="command-center-card__label">Project Manager</p>
                            <p className="command-center-card__value" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <a href="#demo" className="text-link" onClick={(e) => e.preventDefault()}>Jenna Brown</a>
                              <svg
                                className="command-center-card__inline-icon"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                />
                              </svg>
                            </p>
                          </div>
                          <div className="command-center-card">
                            <p className="command-center-card__label">Project Type</p>
                            <p className="command-center-card__value">Firm Fixed Price</p>
                          </div>
                        </div>
                      </CommandCenterPanelSection>
                    </div>
                  </CommandCenterPanel>
                ) : null
              }
              sortColumns={commandCenterSortColumns}
              sortColumn={ccSortKey}
              sortDirection={ccSortDir}
              onSort={(key, dir) => { setCcSortKey(key); setCcSortDir(dir) }}
              onFilterClick={() => {}}
              selectedRowId={ccSelectedId}
              onRowSelect={(id) => { setCcSelectedId(id); setCcPanelOpen(true) }}
              body={(
                <tbody>
                  <tr data-row-id="10105" data-has-children={true}>
                    <td>10105</td>
                    <td>Metro Transit Program</td>
                    <td className="text-right">$16,950,000.00</td>
                    <td className="text-right">$1,200,000.00</td>
                  </tr>
                  <tr data-row-id="10105.01" data-parent-id="10105" data-depth={1}>
                    <td>10105.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$1,200,000.00</td>
                    <td className="text-right">$90,000.00</td>
                  </tr>
                  <tr data-row-id="10160" data-has-children={true}>
                    <td>10160</td>
                    <td>Coastal Resilience</td>
                    <td className="text-right">$2,100,000.00</td>
                    <td className="text-right">$410,000.00</td>
                  </tr>
                  <tr data-row-id="10160.01" data-parent-id="10160" data-depth={1}>
                    <td>10160.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$200,000.00</td>
                    <td className="text-right">$32,000.00</td>
                  </tr>
                  <tr data-row-id="10215" data-has-children={true}>
                    <td>10215</td>
                    <td>Urban Water Systems</td>
                    <td className="text-right">$4,875,000.00</td>
                    <td className="text-right">$612,000.00</td>
                  </tr>
                  <tr data-row-id="10215.01" data-parent-id="10215" data-depth={1}>
                    <td>10215.01</td>
                    <td>Phase I — Site Assessment</td>
                    <td className="text-right">$1,200,000.00</td>
                    <td className="text-right">$180,000.00</td>
                  </tr>
                  <tr data-row-id="10215.02" data-parent-id="10215" data-depth={1}>
                    <td>10215.02</td>
                    <td>Phase II — Remediation</td>
                    <td className="text-right">$1,100,000.00</td>
                    <td className="text-right">$95,000.00</td>
                  </tr>
                  <tr data-row-id="10340" data-has-children={true}>
                    <td>10340</td>
                    <td>Regional Power Grid</td>
                    <td className="text-right">$12,300,000.00</td>
                    <td className="text-right">$2,450,000.00</td>
                  </tr>
                  <tr data-row-id="10340.01" data-parent-id="10340" data-depth={1}>
                    <td>10340.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$900,000.00</td>
                    <td className="text-right">$110,000.00</td>
                  </tr>
                  <tr data-row-id="10475" data-has-children={true}>
                    <td>10475</td>
                    <td>Public Health Initiative</td>
                    <td className="text-right">$3,200,000.00</td>
                    <td className="text-right">$285,000.00</td>
                  </tr>
                  <tr data-row-id="10475.01" data-parent-id="10475" data-depth={1}>
                    <td>10475.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$310,000.00</td>
                    <td className="text-right">$25,000.00</td>
                  </tr>
                  <tr data-row-id="10625" data-has-children={true}>
                    <td>10625</td>
                    <td>Intl Nutrition Advocacy</td>
                    <td className="text-right">$8,200,000.00</td>
                    <td className="text-right">$920,000.00</td>
                  </tr>
                  <tr data-row-id="10625.01" data-parent-id="10625" data-depth={1}>
                    <td>10625.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$750,000.00</td>
                    <td className="text-right">$85,000.00</td>
                  </tr>
                  <tr data-row-id="10720" data-has-children={true}>
                    <td>10720</td>
                    <td>Green Building Standards</td>
                    <td className="text-right">$1,450,000.00</td>
                    <td className="text-right">$198,000.00</td>
                  </tr>
                  <tr data-row-id="10720.01" data-parent-id="10720" data-depth={1}>
                    <td>10720.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$140,000.00</td>
                    <td className="text-right">$18,000.00</td>
                  </tr>
                  <tr data-row-id="10855" data-has-children={true}>
                    <td>10855</td>
                    <td>Digital Services Platform</td>
                    <td className="text-right">$5,600,000.00</td>
                    <td className="text-right">$1,100,000.00</td>
                  </tr>
                  <tr data-row-id="10855.01" data-parent-id="10855" data-depth={1}>
                    <td>10855.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$500,000.00</td>
                    <td className="text-right">$80,000.00</td>
                  </tr>
                  <tr data-row-id="10910" data-has-children={true}>
                    <td>10910</td>
                    <td>Airport Modernization</td>
                    <td className="text-right">$22,400,000.00</td>
                    <td className="text-right">$3,800,000.00</td>
                  </tr>
                  <tr data-row-id="10910.01" data-parent-id="10910" data-depth={1}>
                    <td>10910.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$1,200,000.00</td>
                    <td className="text-right">$200,000.00</td>
                  </tr>
                  <tr data-row-id="11002" data-has-children={true}>
                    <td>11002</td>
                    <td>Highway Corridor Study</td>
                    <td className="text-right">$990,000.00</td>
                    <td className="text-right">$125,000.00</td>
                  </tr>
                  <tr data-row-id="11002.01" data-parent-id="11002" data-depth={1}>
                    <td>11002.01</td>
                    <td>Milestone 01</td>
                    <td className="text-right">$80,000.00</td>
                    <td className="text-right">$9,000.00</td>
                  </tr>
                </tbody>
              )}
            />
        </div>
      </div>
    </div>
  )
}

/** Collects every icon name from the manifest (all themes) and fallbacks, then renders a grid. Missing icons show "?". */
function IconsDemo() {
  const manifest = iconManifest as Record<string, Record<string, unknown>>
  const namesFromManifest = new Set<string>()
  for (const theme of Object.keys(manifest)) {
    const themeData = manifest[theme]
    if (themeData && typeof themeData === 'object' && !Array.isArray(themeData)) {
      for (const key of Object.keys(themeData)) namesFromManifest.add(key)
    }
  }
  const allNames = [...new Set([...namesFromManifest, ...FALLBACK_ICON_NAMES])].sort((a, b) => a.localeCompare(b, 'en'))
  return (
    <div style={{ padding: '0.5rem 0' }}>
      <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        All icons from the manifest (cp, vp, ppm, maconomy) and React fallbacks. Missing icons show &quot;?&quot; with a tooltip.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '1rem',
        }}
      >
        {allNames.map((name) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-04)',
              background: 'var(--surface-bg)',
            }}
          >
            <Icon name={name} size="lg" />
            <span style={{ fontSize: '0.7rem', wordBreak: 'break-word', textAlign: 'center' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Wraps a single Step in the stepper container so it matches how steps look inside Stepper (layout is driven by .stepper--horizontal .step). */
function StepDemo() {
  return (
    <div className="stepper stepper--horizontal" data-stepper role="group" aria-label="Stepper">
      <Step
        label="Step 1"
        stepNumber={1}
        description="Step one"
        isActive
      />
    </div>
  )
}

/** List menu: with icons and text-only items. */
function ListMenuDemo() {
  const row = (label: string, content: React.ReactNode) => (
    <div key={label} style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ maxWidth: '20rem' }}>{content}</div>
    </div>
  )
  const withIcons = [
    { icon: 'home' as const, label: 'Dashboard', active: true },
    { icon: 'user' as const, label: 'Profile' },
    { icon: 'cog-6-tooth' as const, label: 'Settings' },
    { icon: 'arrow-right-on-rectangle' as const, label: 'Logout' },
  ]
  const withoutIcons = [
    { label: 'Overview', active: true },
    { label: 'Details' },
    { label: 'History' },
    { label: 'Export' },
  ]
  return (
    <>
      {row('With icons', <ListMenu items={withIcons} />)}
      {row('Without icons', <ListMenu items={withoutIcons} />)}
    </>
  )
}

const kanbanGalleryDefaultColumns = [
  { id: 'col-1', title: 'To Do', cards: [{ id: 'card-1', title: 'Task 1' }] },
  { id: 'col-2', title: 'Done', cards: [] },
]

const kanbanCpCardFieldsConfig: KanbanViewCardField[] = [
  { position: 1, fieldName: 'Assigned', enabled: true, styleId: 'default' },
  { position: 2, fieldName: 'Due', enabled: true, styleId: 'default' },
  { position: 3, fieldName: 'Reserve', enabled: false },
  { position: 4, fieldName: 'Priority', enabled: true, styleId: 'default' },
  { position: 5, fieldName: 'Notes', enabled: false },
]

const kanbanCpGalleryColumns = [
  {
    id: 'new',
    title: 'New',
    headerColorLight: '#2563eb',
    loadMoreRemaining: 4,
    cards: [
      {
        id: 'cp-g-1',
        title: 'PROP-001',
        selected: true,
        valuesByFieldName: {
          Assigned: 'J. Smith',
          Due: '04/15/2026',
          Priority: 'High',
        },
      },
      {
        id: 'cp-g-2',
        title: 'PROP-002',
        valuesByFieldName: {
          Assigned: 'K. Ortiz',
          Due: '04/18/2026',
          Priority: 'Medium',
        },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    headerColorLight: '#7c3aed',
    loadMoreRemaining: 12,
    cards: [
      {
        id: 'cp-g-3',
        title: 'PROP-055',
        valuesByFieldName: {
          Assigned: 'R. Patel',
          Due: '03/01/2026',
          Priority: 'Medium',
        },
      },
    ],
  },
]

function readHtmlThemeCp(): boolean {
  return document.documentElement.classList.contains('theme-cp')
}

/** Theme-aware Kanban: Costpoint shell when <code>html.theme-cp</code>, default board otherwise (matches Astro docs routing). */
function KanbanDemo() {
  const [isCp, setIsCp] = useState(readHtmlThemeCp)

  useEffect(() => {
    const el = document.documentElement
    const sync = () => setIsCp(readHtmlThemeCp())
    const obs = new MutationObserver(sync)
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  if (isCp) {
    return (
      <div style={{ overflowX: 'auto', width: '100%', minHeight: 'min(70vh, 520px)' }}>
        <Kanban
          variant="costpoint"
          cardFieldsConfig={kanbanCpCardFieldsConfig}
          columns={kanbanCpGalleryColumns}
          cpRecordShown={3}
          cpRecordTotal={127}
          cpSortedBy="Due Date"
          cpScrollColumnIndex={1}
        />
      </div>
    )
  }

  return <Kanban columns={kanbanGalleryDefaultColumns} />
}

export const componentRegistry: ComponentRegistryEntry[] = [
  { name: 'Accordion', Component: AccordionDemo as AnyComponent },
  { name: 'Alert', Component: AlertDemo as AnyComponent },
  { name: 'Avatar', Component: AvatarDemo as AnyComponent },
  { name: 'Badge', Component: BadgeDemo as AnyComponent },
  { name: 'Button', Component: ButtonDemo as AnyComponent },
  { name: 'ButtonGroup', Component: ButtonGroupDemo as AnyComponent },
  { name: 'Card', Component: CardDemo as AnyComponent },
  { name: 'Checkbox', Component: CheckboxDemo as AnyComponent },
  { name: 'CheckboxGroup', Component: CheckboxGroup as AnyComponent, demoProps: { legend: 'Options', children: <><Checkbox label="Option A" /><Checkbox label="Option B" /></> } },
  { name: 'Chip', Component: Chip as AnyComponent, demoProps: { label: 'Chip' } },
  { name: 'DateInput', Component: DateInput as AnyComponent, demoProps: { id: 'demo-date', label: 'Date' } },
  { name: 'DatePicker', Component: DatePicker as AnyComponent },
  { name: 'DateTimePicker', Component: DateTimePicker as AnyComponent },
  { name: 'Dialog', Component: DialogDemo as AnyComponent },
  { name: 'Dropdown', Component: Dropdown as AnyComponent, demoProps: { options: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }], placeholder: 'Select' } },
  { name: 'FloatingNav', Component: FloatingNav as AnyComponent },
  { name: 'Icon', Component: Icon as AnyComponent, demoProps: { name: 'check' } },
  { name: 'Icons', Component: IconsDemo as AnyComponent },
  { name: 'Input', Component: InputDemo as AnyComponent },
  { name: 'Kanban', Component: KanbanDemo as AnyComponent },
  { name: 'KanbanCard', Component: KanbanCard as AnyComponent, demoProps: { id: 'demo-card', title: 'Card title' } },
  {
    name: 'KanbanCardCostpoint',
    Component: KanbanCardCostpoint as AnyComponent,
    demoProps: {
      id: 'demo-cp-card',
      title: 'Sample project',
      fieldsConfig: [
        { position: 1, fieldName: 'Code', enabled: true, styleId: 'emphasis' },
        { position: 2, fieldName: 'Owner', enabled: true, styleId: 'default' },
        { position: 3, fieldName: 'Reserve', enabled: false },
        { position: 4, fieldName: 'Due', enabled: true, styleId: 'default' },
        { position: 5, fieldName: 'Notes', enabled: true, styleId: 'multiline' },
      ],
      valuesByFieldName: { Code: 'P-1', Owner: 'Demo', Due: '—', Notes: 'Line one\nLine two' },
      moveOptions: [
        { value: 'open', label: 'Open' },
        { value: 'done', label: 'Done', disabled: true },
      ],
    },
  },
  { name: 'Label', Component: Label as AnyComponent, demoProps: { htmlFor: 'demo', children: 'Label' } },
  { name: 'LeftSidebar', Component: LeftSidebar as AnyComponent },
  { name: 'Link', Component: LinkDemo as AnyComponent },
  { name: 'ListMenu', Component: ListMenuDemo as AnyComponent },
  { name: 'MonthPicker', Component: MonthPicker as AnyComponent },
  { name: 'NotificationBadge', Component: NotificationBadge as AnyComponent, demoProps: { count: 3, children: <span>Inbox</span> } },
  { name: 'NumberInput', Component: NumberInput as AnyComponent, demoProps: { id: 'demo-num', label: 'Number' } },
  { name: 'PickerPopup', Component: PickerPopupDemo as AnyComponent },
  { name: 'ProgressBar', Component: ProgressBar as AnyComponent, demoProps: { value: 60, max: 100 } },
  { name: 'RadioButton', Component: RadioButtonDemo as AnyComponent },
  { name: 'RadioGroup', Component: RadioGroup as AnyComponent, demoProps: { name: 'demo', legend: 'Choose', children: <><RadioButton name="demo" value="a" label="Option A" defaultChecked /><RadioButton name="demo" value="b" label="Option B" /></> } },
  { name: 'RangeInput', Component: RangeInput as AnyComponent, demoProps: { id: 'demo-range', min: 0, max: 100, defaultValue: 50 } },
  { name: 'RightSidebar', Component: RightSidebar as AnyComponent },
  { name: 'ShellFooter', Component: ShellFooter as AnyComponent, demoProps: { tabs: [{ id: 't1', label: 'Home', active: true }, { id: 't2', label: 'Projects' }] } },
  { name: 'ShellHeader', Component: ShellHeader as AnyComponent },
  { name: 'ShellLayout', Component: ShellLayout as AnyComponent, fullPage: true },
  { name: 'ShellPageHeader', Component: ShellPageHeader as AnyComponent, demoProps: { title: 'Page Title' } },
  { name: 'ShellPanel', Component: ShellPanel as AnyComponent, demoProps: { side: 'left', open: true, title: 'Panel', onClose: () => {}, children: 'Panel content' } },
  { name: 'Spinner', Component: Spinner as AnyComponent },
  { name: 'Step', Component: StepDemo as AnyComponent },
  { name: 'Stepper', Component: Stepper as AnyComponent, demoProps: { steps: [{ label: 'First', description: 'Step one' }, { label: 'Second', description: 'Step two', completed: true }, { label: 'Third', description: 'Step three' }], activeStep: 1 } },
  { name: 'Table', Component: TableDemo as AnyComponent },
  { name: 'TabStrip', Component: TabStripDemo as AnyComponent },
  { name: 'Textarea', Component: Textarea as AnyComponent, demoProps: { id: 'demo-ta', label: 'Description', placeholder: 'Enter text' } },
  { name: 'TimePicker', Component: TimePicker as AnyComponent },
  { name: 'Toggle', Component: ToggleDemo as AnyComponent },
  { name: 'Tooltip', Component: Tooltip as AnyComponent, demoProps: { text: 'Tooltip text', children: <span>Hover me</span> } },
  { name: 'WeekPicker', Component: WeekPicker as AnyComponent },
]

export function getComponentByName(name: string): ComponentRegistryEntry | undefined {
  return componentRegistry.find((entry) => entry.name === name)
}
