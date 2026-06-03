'use client'

import { useRef } from 'react'
import { MENU, MenuSection as MenuSectionType, MenuItem } from '@/lib/menu'
import styles from './MenuSection.module.css'

function PriceCell({ item, header }: { item: MenuItem; header: string }) {
  const price = item.prices[header] ?? item.prices['default'] ?? '—'
  return <span className={styles.price}>{price}</span>
}

function CategoryBlock({ category }: { category: MenuSectionType['categories'][number] }) {
  const hasHeaders = category.priceHeaders && category.priceHeaders.length > 0

  return (
    <div className={styles.category}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryName}>{category.name}</h3>
        {hasHeaders && (
          <div className={styles.priceHeaders}>
            {category.priceHeaders!.map(h => (
              <span key={h} className={styles.priceHeader}>{h}</span>
            ))}
          </div>
        )}
      </div>

      {category.note && <p className={styles.categoryNote}>{category.note}</p>}

      <div className={styles.items}>
        {category.items.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.itemName}>{item.name}</span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
              {item.detail && <span className={styles.itemDetail}>{item.detail}</span>}
            </div>
            <div className={styles.itemPrices}>
              {hasHeaders ? (
                category.priceHeaders!.map(h => (
                  <PriceCell key={h} item={item} header={h} />
                ))
              ) : (
                Object.keys(item.prices).length > 0 && (
                  <span className={styles.price}>{item.prices['default'] ?? ''}</span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MenuSection() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  return (
    <div id="menu" className={styles.wrap}>
      <div className={styles.sections}>
        {MENU.map(section => (
          <div
            key={section.id}
            ref={el => { sectionRefs.current[section.id] = el }}
            className={styles.section}
          >
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>— La carte</p>
              <h2 className={styles.sectionTitle}>{section.label.toUpperCase()}</h2>
            </div>
            <div className={styles.categories}>
              {section.categories.map((cat, i) => (
                <CategoryBlock key={i} category={cat} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
