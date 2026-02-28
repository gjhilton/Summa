import { useState } from "react";
import { css, cx } from "../generated/css";
import Button from "./Button";
import Footer from "./Footer";
import PageLayout from "./PageLayout";
import Logo from "./Logo";
import LineItem from "./LineItem";
import ExtendedItem from "./ExtendedItem";
import SubtotalItem from "./SubtotalItem";
import Toggle from "./Toggle";
import noWorkingImg from "../assets/no-working.png";
import {
  emptyLine,
  emptyExtendedItem,
  emptySubtotalItem,
  processFieldUpdate,
  recomputeSubtotal,
  updateExtendedItemField,
  updateExtendedItemQuantity,
} from "../state/calculationLogic";
import { toLineView } from "../state/displayLogic";
import { LineState, ExtendedItemState, SubtotalItemState } from "../types/calculation";
import { LineItemView, ExtendedItemView, SubtotalItemView } from "../types/lineView";

interface AboutScreenProps {
  onClose: () => void;
  isFirstVisit?: boolean;
  onGetStarted?: () => void;
}

const srOnly = css({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
});

const pageHeading = css({
  fontFamily: "joscelyn",
  fontSize: "xl",
  fontWeight: "bold",
  marginBottom: "3xl",
});

const body = css({
  display: "flex",
  flexDirection: "column",
  gap: "2xl",
  marginBottom: "3xl",
  lineHeight: "1.7",
  fontSize: "18px",
});

const listOrdered = css({
  listStyleType: "decimal",
  paddingLeft: "1.5em",
});

const listUnordered = css({
  listStyleType: "disc",
  paddingLeft: "1.5em",
});

const backBar = css({ marginBottom: "3xl" });

const getStartedBar = css({
  display: "flex",
  justifyContent: "center",
  marginTop: "3xl",
  marginBottom: "3xl",
});

const getStartedButton = css({
  fontSize: "xl",
  px: "4xl",
  py: "lg",
});

const logoWrap = css({ textAlign: "center", marginBottom: "3xl" });

const snapshot = css({ overflow: "hidden" });

const exampleFrame = css({
  borderWidth: "thin",
  borderStyle: "solid",
  borderColor: "ink",
  bg: "muted",
  boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
});

const sectionBlock = css({
  display: "flex",
  flexDirection: "column",
  gap: "xl",
  marginTop: "4rem",
});

const sectionHeading = css({
  fontFamily: "joscelyn",
  fontSize: "xl",
  fontWeight: "bold",
});

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className={sectionBlock}>
      <h2 className={sectionHeading}>{heading}</h2>
      {children}
    </section>
  );
}

const noop = () => {};

export default function AboutScreen({
  onClose,
  isFirstVisit = false,
  onGetStarted,
}: AboutScreenProps) {
  const [example1, setExample1] = useState<LineState>(() => {
    let lines = [emptyLine()];
    const id = lines[0].id;
    lines = processFieldUpdate(lines, id, "l", "xx");
    lines = processFieldUpdate(lines, id, "s", "v");
    lines = processFieldUpdate(lines, id, "d", "iiij");
    return lines[0] as LineState;
  });

  const [demoShowWorking, setDemoShowWorking] = useState(true);
  const [demo, setDemo] = useState<LineState>(() => {
    let lines = [emptyLine()];
    const id = lines[0].id;
    lines = processFieldUpdate(lines, id, "l", "xx");
    lines = processFieldUpdate(lines, id, "s", "v");
    lines = processFieldUpdate(lines, id, "d", "iiij");
    return lines[0] as LineState;
  });

  const [subtotalItem, setSubtotalItem] = useState<SubtotalItemState>(() => {
    const item = emptySubtotalItem();
    let lines = item.lines;
    const id0 = lines[0].id;
    const id1 = lines[1].id;
    lines = processFieldUpdate(lines, id0, "l", "i");
    lines = processFieldUpdate(lines, id0, "s", "ii");
    lines = processFieldUpdate(lines, id0, "d", "iii");
    lines = processFieldUpdate(lines, id1, "l", "ii");
    lines = processFieldUpdate(lines, id1, "s", "iii");
    lines = processFieldUpdate(lines, id1, "d", "iv");
    return recomputeSubtotal({ ...item, lines });
  });

  const [extendedItem, setExtendedItem] = useState<ExtendedItemState>(() => {
    let item = emptyExtendedItem();
    item = updateExtendedItemQuantity(item, "iii");
    item = updateExtendedItemField(item, "s", "v");
    item = updateExtendedItemField(item, "d", "iiij");
    return item;
  });

  const handleExtendedItemField = (f: "l" | "s" | "d", v: string) =>
    setExtendedItem((prev) => updateExtendedItemField(prev, f, v));

  const handleExtendedItemQuantity = (v: string) =>
    setExtendedItem((prev) => updateExtendedItemQuantity(prev, v));

  return (
    <PageLayout>
      {!isFirstVisit && (
        <div className={backBar}>
          <Button onClick={onClose}>← Back</Button>
        </div>
      )}
      <h1 className={srOnly}>Summa</h1>
      <div className={logoWrap}>
        <Logo size="M" />
      </div>

      {isFirstVisit && onGetStarted && (
        <>
          <Section heading="No warranty / Cookies">
            <p>
              This software is provided free of charge and with{" "}
              <strong>no warranty of correctness</strong>. It's beta software
              written in a few hours and almost certainly contains defects and
              errors. You are strongly advised to check any results you obtain
              from Summa.
            </p>
            <p>
              We use cookies and local storage to persist your preferences and
              work between sessions. We don't collect user data or analytics of
              any kind to our knowledge, but we DO use Google fonts and they
              might.
            </p>
            <p>By continuing you agree to the above.</p>
          </Section>
          <div className={getStartedBar}>
            <Button
              onClick={onGetStarted}
              variant="danger"
              className={getStartedButton}
            >
              Get started →
            </Button>
          </div>
        </>
      )}

      <h2 className={pageHeading}>About</h2>
      <div className={body}>
        <p>
          Summa is a simple spreadsheet for historians working with Early Modern
          British ledgers, accounts and similar documents.
        </p>
        <div className={cx(exampleFrame, snapshot)}>
          <img
            src={noWorkingImg}
            alt="Summa calculation"
            style={{ width: "90%", display: "block", margin: "0 auto" }}
          />
        </div>
        <p>
          For clerks of the era, summing columns of figures expressed as pounds,
          shillings and pence in Roman numerals was second nature. For modern
          users the calculations can be error-prone, and in large quantities
          quickly become tedious. Summa automates the calculation.
        </p>

        <Section heading="The Calculation">
          <p>Summa uses the following algorithm:</p>
          <ol className={listOrdered}>
            <li>Convert Roman numerals to regular Arabic integers.</li>
            <li>
              Canonicalise pounds and shillings to amounts of pence (£1 = 240d;
              1/&#x2212; = 12d).
            </li>
            <li>Sum the amounts denominated in pence.</li>
            <li>Convert the sum back into its £, s, d denominations.</li>
            <li>Convert each amount to Roman numerals.</li>
          </ol>
        </Section>

        <Section heading="How to use: Items">
          <p>
            Input each line of your calculation as pounds, shillings and pence
            in Roman numerals. The total updates automatically. NB the example
            below is editable so you can experiment — try inputting an invalid
            value like 'dog' and see what happens.
          </p>
          <div className={exampleFrame}>
            <LineItem
              view={toLineView(example1) as LineItemView}
              canRemove={false}
              showWorking={false}
              onChangeField={(f, v) =>
                setExample1((prev) => processFieldUpdate([prev], prev.id, f, v)[0] as LineState)
              }
              onRemove={noop}
              onChangeTitle={noop}
            />
          </div>
          <p>
            To add another line item, click the <em>Add item</em> button.
          </p>
        </Section>

        <Section heading="Advanced option: Extended Items">
          <p>
            If you choose to enable this advanced feature (via the{" "}
            <em>Advanced options</em> toggle on the main screen), you can add{" "}
            <em>Extended Items</em> to your calculation. Extended Items
            comprise a quantity field and a unit cost in pounds shillings and
            pence bracketed together. From this the system computes the
            extended cost by multiplication — which is shown on the following
            line (and then summed with any other items you have added).
          </p>
          <div className={exampleFrame}>
            <ExtendedItem
              view={toLineView(extendedItem) as ExtendedItemView}
              canRemove={false}
              showWorking={false}
              onChangeField={handleExtendedItemField}
              onChangeQuantity={handleExtendedItemQuantity}
              onRemove={noop}
              onChangeTitle={noop}
            />
          </div>
        </Section>

        <Section heading="Advanced option: Subtotal Items">
          <p>
            Subtotal Items group a set of lines into a nested sub-calculation.
            The subtotal of that group is then carried forward into the parent
            calculation. Click the pencil icon to edit the lines inside a
            Subtotal Item.
          </p>
          <div className={exampleFrame}>
            <SubtotalItem
              view={toLineView(subtotalItem) as SubtotalItemView}
              canRemove={false}
              showWorking={false}
              onEdit={() => window.alert("In the real calculator, this opens the sub-calculation for editing.")}
              onRemove={noop}
              onChangeTitle={(v) => setSubtotalItem((prev) => ({ ...prev, title: v }))}
            />
          </div>
        </Section>

        <Section heading="How to use: Show Working">
          <p>
            The <em>Show working</em> switch toggles display of the intermediate
            calculations, which can be useful for tracking down clerical errors
            in the source material.
          </p>
          <div className={exampleFrame}>
            <Toggle
              id="about-show-working"
              label="Show working"
              checked={demoShowWorking}
              onChange={setDemoShowWorking}
            />
            <LineItem
              view={toLineView(demo) as LineItemView}
              canRemove={false}
              showWorking={demoShowWorking}
              onChangeField={(f, v) =>
                setDemo((prev) => processFieldUpdate([prev], prev.id, f, v)[0] as LineState)
              }
              onRemove={noop}
              onChangeTitle={noop}
            />
          </div>
        </Section>

        <Section heading="Coming soon">
          <ul className={listUnordered}>
            <li>Mobile device compatibility.</li>
            <li>Support for ½d (Obolus)</li>
            <li>Improved printing.</li>
          </ul>
          <p>
            Please suggest features which would make Summa more useful on the{" "}
            <a href="https://github.com/gjhilton/Summa/issues">
              GitHub issues page
            </a>
            .
          </p>
        </Section>
      </div>

      <Footer />
    </PageLayout>
  );
}
