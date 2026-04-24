import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { Modal } from './components/Modal'
import type { Card } from './game/cards'
import { cardLabel, makeShuffledDeck } from './game/cards'
import { RULES, ruleTitle } from './game/rules'

type HolderRank = '4' | '5' | '8'

function App() {
  const [deck, setDeck] = useState<Card[]>(() => makeShuffledDeck())
  const [cursor, setCursor] = useState(0)
  const [drawn, setDrawn] = useState<Card[]>([])

  const [ruleCard, setRuleCard] = useState<Card | null>(null)

  const [ladyName, setLadyName] = useState('')
  const [isLadyModalOpen, setIsLadyModalOpen] = useState(false)

  const [crazyPeople, setCrazyPeople] = useState<string[]>([])
  const [isCrazyModalOpen, setIsCrazyModalOpen] = useState(false)

  const [holders4, setHolders4] = useState<string[]>([])
  const [holders5, setHolders5] = useState<string[]>([])
  const [holders8, setHolders8] = useState<string[]>([])
  const [isHoldersModalOpen, setIsHoldersModalOpen] = useState<HolderRank | null>(null)

  const [nextKShots, setNextKShots] = useState<number | null>(null)
  const [kModalOpen, setKModalOpen] = useState(false)
  const [kDraft, setKDraft] = useState('')

  const currentCard = cursor < deck.length ? deck[cursor] : null
  const remaining = deck.length - cursor

  const holdersByRank = useMemo(() => {
    return {
      '4': holders4,
      '5': holders5,
      '8': holders8,
    } as const
  }, [holders4, holders5, holders8])

  function resetRound() {
    setDeck(makeShuffledDeck())
    setCursor(0)
    setDrawn([])
    setRuleCard(null)
    setLadyName('')
    setCrazyPeople([])
    setHolders4([])
    setHolders5([])
    setHolders8([])
    setNextKShots(null)
    setKDraft('')
    setIsLadyModalOpen(false)
    setIsCrazyModalOpen(false)
    setIsHoldersModalOpen(null)
    setKModalOpen(false)
  }

  function drawOne() {
    if (!currentCard) return

    const next = currentCard
    setCursor((c) => c + 1)
    setDrawn((prev) => [next, ...prev])

    if (next.rank === '2') {
      setIsLadyModalOpen(true)
    } else if (next.rank === '10') {
      setIsCrazyModalOpen(true)
    } else if (next.rank === '4' || next.rank === '5' || next.rank === '8') {
      setIsHoldersModalOpen(next.rank)
    } else if (next.rank === 'K') {
      setKDraft(nextKShots == null ? '' : String(nextKShots))
      setKModalOpen(true)
    }
  }

  useEffect(() => {
    if (cursor >= deck.length) return
  }, [cursor, deck.length])

  const canDraw = currentCard != null
  const lastDrawn = drawn[0] ?? null

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="brandTitle">小姐牌</div>
          <div className="brandSub">随机抽牌 + 规则查看 + 状态记录</div>
        </div>
        <div className="topbarRight">
          <div className="pill">剩余：{remaining} / 52</div>
          <button type="button" className="btn secondary" onClick={resetRound}>
            重置本轮
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <div className="panelTitle">抽牌</div>

          <div className="cardArea">
            <div className="cardFace" data-empty={!currentCard}>
              {currentCard ? cardLabel(currentCard) : '已抽完'}
            </div>
            <div className="cardActions">
              <button
                type="button"
                className="btn primary"
                onClick={drawOne}
                disabled={!canDraw}
              >
                抽一张
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setRuleCard(currentCard)}
                disabled={!currentCard}
              >
                查看该牌规则
              </button>
            </div>

            <div className="hint">
              说明：抽到 <b>2</b> 会弹窗设置“小姐名”；抽到 <b>10</b> 会弹窗管理“神经病”；抽到
              <b>4/5/8</b> 会弹窗管理“持牌者”；抽到 <b>K</b> 会弹窗设置“下一个K喝多少”。
            </div>
          </div>

          <div className="panelTitle sub">最近抽到</div>
          <div className="lastRow">
            <div className="lastCard">{lastDrawn ? cardLabel(lastDrawn) : '（暂无）'}</div>
            <button
              type="button"
              className="btn"
              onClick={() => setRuleCard(lastDrawn)}
              disabled={!lastDrawn}
            >
              查看规则
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panelTitle">当前状态</div>

          <div className="grid2">
            <div className="kv">
              <div className="k">小姐名（抽到2才可修改）</div>
              <div className="v">{ladyName || '（空）'}</div>
              <div className="actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsLadyModalOpen(true)}
                  disabled={lastDrawn?.rank !== '2'}
                  title={lastDrawn?.rank !== '2' ? '只有抽到2时才能修改' : undefined}
                >
                  修改
                </button>
              </div>
            </div>

            <div className="kv">
              <div className="k">下一个 K 喝多少</div>
              <div className="v">{nextKShots == null ? '（未设置）' : `${nextKShots} 杯`}</div>
              <div className="actions">
                <button type="button" className="btn" onClick={() => setKModalOpen(true)}>
                  设置
                </button>
              </div>
            </div>
          </div>

          <div className="panelTitle sub">神经病（最多4个，抽到10弹窗修改）</div>
          <div className="listRow">
            <div className="chips">
              {crazyPeople.length === 0 ? (
                <span className="muted">（空）</span>
              ) : (
                crazyPeople.map((n, idx) => (
                  <span key={`${idx}-${n}`} className="chip">
                    {n || '（空）'}
                  </span>
                ))
              )}
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => setIsCrazyModalOpen(true)}
              disabled={lastDrawn?.rank !== '10'}
              title={lastDrawn?.rank !== '10' ? '抽到10时会弹窗修改；也可在抽到10后再次打开' : undefined}
            >
              修改
            </button>
          </div>

          <div className="panelTitle sub">随时触发牌持牌者（4/5/8，各最多4个）</div>
          <div className="holders">
            {(['4', '5', '8'] as const).map((r) => (
              <div key={r} className="holderBox">
                <div className="holderHeader">
                  <div className="holderTitle">{r} 持牌者</div>
                  <button type="button" className="btn" onClick={() => setIsHoldersModalOpen(r)}>
                    管理
                  </button>
                </div>
                <div className="chips">
                  {holdersByRank[r].length === 0 ? (
                    <span className="muted">（空）</span>
                  ) : (
                    holdersByRank[r].map((n, idx) => (
                      <span key={`${r}-${idx}-${n}`} className="chip">
                        {n || '（空）'}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel history">
          <div className="panelTitle">
            抽牌历史 <span className="muted">（最新在前）</span>
          </div>
          {drawn.length === 0 ? (
            <div className="muted">还没抽牌。</div>
          ) : (
            <div className="historyGrid">
              {drawn.map((c, i) => (
                <button
                  key={`${c.id}-${i}`}
                  type="button"
                  className="historyCard"
                  onClick={() => setRuleCard(c)}
                  title="点击查看规则"
                >
                  {cardLabel(c)}
                </button>
              ))}
            </div>
          )}
          {!canDraw && (
            <div className="endRow">
              <div className="muted">已抽完全部牌。</div>
              <button type="button" className="btn primary" onClick={resetRound}>
                重新开始
              </button>
            </div>
          )}
        </section>
      </main>

      <Modal
        open={ruleCard != null}
        title={ruleCard ? `${cardLabel(ruleCard)} - ${ruleTitle(ruleCard.rank)}` : '规则'}
        onClose={() => setRuleCard(null)}
      >
        <div className="ruleText">
          {ruleCard ? RULES[ruleCard.rank] : ''}
          {ruleCard?.rank === '2' && (
            <div className="ruleExtra">
              <div>
                当前小姐名：<b>{ladyName || '（空）'}</b>
              </div>
            </div>
          )}
          {ruleCard?.rank === 'K' && (
            <div className="ruleExtra">
              <div>
                下一个 K 喝多少：<b>{nextKShots == null ? '（未设置）' : `${nextKShots} 杯`}</b>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={isLadyModalOpen}
        title="设置小姐名（抽到2触发，可为空）"
        onClose={() => setIsLadyModalOpen(false)}
      >
        <div className="form">
          <label className="label">
            小姐名
            <input
              value={ladyName}
              onChange={(e) => setLadyName(e.target.value)}
              placeholder="可留空"
              className="input"
            />
          </label>
          <div className="modalActions">
            <button type="button" className="btn primary" onClick={() => setIsLadyModalOpen(false)}>
              确定
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isCrazyModalOpen}
        title="神经病名单（最多4个，可为空）"
        onClose={() => setIsCrazyModalOpen(false)}
      >
        <div className="form">
          <div className="muted small">抽到10会弹出此窗口；你可以在这里增删改（最多4个）。</div>
          <div className="slots">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="slotRow">
                <input
                  className="input"
                  placeholder={`第 ${i + 1} 个（可空）`}
                  value={crazyPeople[i] ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setCrazyPeople((prev) => {
                      const next = prev.slice(0, 4)
                      while (next.length < 4) next.push('')
                      next[i] = v
                      return next.filter((x) => x !== '' || next.some((y) => y !== ''))
                    })
                  }}
                />
                <button
                  type="button"
                  className="btn danger"
                  onClick={() => {
                    setCrazyPeople((prev) => prev.filter((_, idx) => idx !== i))
                  }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
          <div className="modalActions">
            <button
              type="button"
              className="btn primary"
              onClick={() => setIsCrazyModalOpen(false)}
            >
              完成
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isHoldersModalOpen != null}
        title={isHoldersModalOpen ? `${isHoldersModalOpen} 持牌者（最多4个，可为空）` : '持牌者'}
        onClose={() => setIsHoldersModalOpen(null)}
      >
        {isHoldersModalOpen && (
          <HoldersEditor
            rank={isHoldersModalOpen}
            value={holdersByRank[isHoldersModalOpen]}
            onChange={(next) => {
              if (isHoldersModalOpen === '4') setHolders4(next)
              if (isHoldersModalOpen === '5') setHolders5(next)
              if (isHoldersModalOpen === '8') setHolders8(next)
            }}
            onClose={() => setIsHoldersModalOpen(null)}
          />
        )}
      </Modal>

      <Modal open={kModalOpen} title="设置下一个 K 喝多少" onClose={() => setKModalOpen(false)}>
        <div className="form">
          <div className="muted small">
            上一次设置：<b>{nextKShots == null ? '（未设置）' : `${nextKShots} 杯`}</b>
          </div>
          <label className="label">
            下一个 K 喝多少（整数）
            <input
              className="input"
              value={kDraft}
              onChange={(e) => setKDraft(e.target.value)}
              placeholder="例如：1"
              inputMode="numeric"
            />
          </label>
          <div className="modalActions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                const n = Number.parseInt(kDraft, 10)
                setNextKShots(Number.isFinite(n) && n > 0 ? n : null)
                setKModalOpen(false)
              }}
            >
              确定
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default App

function HoldersEditor(props: {
  rank: '4' | '5' | '8'
  value: string[]
  onChange: (next: string[]) => void
  onClose: () => void
}) {
  const { rank, value, onChange, onClose } = props
  return (
    <div className="form">
      <div className="muted small">
        {rank === '4' ? '摸鼻子' : rank === '5' ? '照相机' : '厕所牌'} 持牌者可在游戏期间随时修改/删除。
      </div>
      <div className="slots">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="slotRow">
            <input
              className="input"
              placeholder={`第 ${i + 1} 个（可空）`}
              value={value[i] ?? ''}
              onChange={(e) => {
                const v = e.target.value
                const next = value.slice(0, 4)
                while (next.length < 4) next.push('')
                next[i] = v
                onChange(compactSlots(next))
              }}
            />
            <button
              type="button"
              className="btn danger"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            >
              删除
            </button>
          </div>
        ))}
      </div>
      <div className="modalActions">
        <button type="button" className="btn primary" onClick={onClose}>
          完成
        </button>
      </div>
    </div>
  )
}

function compactSlots(slots: string[]) {
  const normalized = slots.slice(0, 4)
  while (normalized.length > 0 && normalized[normalized.length - 1] === '') normalized.pop()
  return normalized
}
