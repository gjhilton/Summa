import { DragCtx } from '@/display/DragCtx'
import { ItemSubTotal, BreadcrumbNav } from '@/display/MainScreen'
import { HelpSection, HelpHeading, HelpPara, ScreenSample } from './shared'
import { MOCK_DRAG_CTX } from './mockDragCtx'

export function HelpSubtotalItems() {
  return (
    <HelpSection>
      <HelpHeading>Subtotal items</HelpHeading>

      <HelpPara>
        A subtotal item groups a set of lines into a nested calculation. It
        appears as a single row in the parent list showing its total; tap{' '}
        <strong>edit</strong> to enter the sub-calculation and work on its
        lines independently. Press <strong>done</strong> to return to the
        level above.
      </HelpPara>

      <ScreenSample>
        <DragCtx.Provider value={MOCK_DRAG_CTX}>
          <ItemSubTotal
            title="Provisions"
            count={3}
            totalDisplay={{ l: '0', s: 'xij', d: '0' }}
            onEdit={() => {}}
          />
        </DragCtx.Provider>
      </ScreenSample>

      <HelpPara>
        When you are inside a sub-calculation, a breadcrumb trail appears at
        the top of the screen showing where you are. Tap any earlier crumb to
        jump back up to that level without pressing <strong>done</strong>
        repeatedly.
      </HelpPara>

      <ScreenSample>
        <BreadcrumbNav
          breadcrumbs={[
            { id: '', title: 'Summary', path: [] },
            { id: 'id1', title: 'Provisions', path: ['id1'] },
          ]}
          onNavigate={() => {}}
        />
      </ScreenSample>

      <HelpPara>
        Undo is local to whichever level you are working at. Undoing within a
        sub-calculation will not undo actions on the level above, and vice
        versa.
      </HelpPara>
    </HelpSection>
  )
}
