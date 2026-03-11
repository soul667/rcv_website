# Homepage 界面优化

## TL;DR
> **总结**：在不改动现有双语文案和 Hero 的前提下，优化首页的阅读体验：精简共享 Footer，去掉冗余的点状/列表化信息块；重排首页实验室介绍区，保留全部原文，只修正现在居中大段文字带来的观感问题。
> **交付物**：
> - `src/components/Footer.tsx` 的精简版共享 Footer
> - `src/components/HomePage.tsx` 的新版介绍区排版
> - 构建验证与中英双语、桌面/移动端 UI 验证证据
> **工作量**：Short
> **可并行**：YES - 2 waves
> **关键路径**：任务 1 + 任务 2 -> 任务 3 -> 最终验证波次

## Context
### 原始需求
优化 homepage 界面，主要包含两点：
- footer 部分“点”太冗余，直接删掉
- 介绍 RCV Lab 的那段英文文案排版不好看，尤其是现在这种居中大段文字的方式

### 访谈结论
- 范围仅限首页相关展示优化，不做路由、数据模型或内容来源改造。
- 保留 `src/components/LanguageContext.tsx` 中现有双语文案，不改写、不删减、不迁移。
- 保留当前暗色 + 玻璃拟态风格，只做更克制的层级和留白优化。
- 默认决策：Footer 作为 `src/App.tsx:41` 中的共享组件，按“全站共享组件”统一精简，不做首页特供 Footer。
- 默认决策：不新增测试框架，用现有 `npm run build` 加浏览器自动化验收。

### Metis 复核结论（已吸收）
- Footer 是全局共享组件，任何改动都会影响其他页面，因此计划中必须验证至少一个非首页页面。
- 当前 Footer 的链接是 hash anchor，但站点实际导航依赖 `src/components/Router.tsx:17` 的内部路由状态；本次不扩 scope 修路由，因此直接移除 Footer 中弱价值且行为不可靠的导航块。
- 中文和英文的换行长度差异较大，验收必须覆盖 `en`/`zh` 与桌面/移动端。
- `src/components/Hero.tsx` 不在本次改动范围内。

## Work Objectives
### 核心目标
让首页看起来更干净、更专业：Footer 更简洁，介绍区更易读，保留全部现有内容，只修正现在“居中大段文字”的笨重排版。

### 交付物
- 一个更简洁的共享 Footer，仅保留品牌信息、简介和版权
- 一个保留全部原文、但改为更合理层级与对齐方式的首页介绍区
- 自动化验证产物，输出到 `.sisyphus/evidence/`

### 完成定义（可验证）
- `npm run build` 退出码为 `0`
- 首页在 `375x812` 与 `1440x900` 下，中英文均无横向溢出
- Footer 不再出现 `Quick Links` / `Research Areas` 及其中文对应内容
- 首页介绍区仍然使用 `hero.description1` 与 `hero.description2` 原始文案，且两段内容都完整显示

### 必须满足
- 保留 `Hero`、保留双语文案 key、保留当前整体视觉语言
- 改动优先收敛在 `src/components/HomePage.tsx` 与 `src/components/Footer.tsx`
- 首页介绍区必须保留全部原文内容，只调整布局、对齐、字号层级、间距和容器样式
- 移动端与桌面端都要避免文字拥挤、居中过长、换行难看或溢出

### 明确禁止
- 不做路由系统改造
- 不做 markdown 数据源迁移
- 不取消/修改 Hero 内容
- 不恢复 `src/components/HomePage.tsx:30` 处被注释的 preview sections
- 不新增测试框架或 Playwright 初始化
- 不为了“更设计感”而引入新的复杂视觉装饰

## Verification Strategy
> ZERO HUMAN INTERVENTION - 全部由 agent 执行验证。
- 测试策略：不新建测试基础设施，使用 `vite build` + 浏览器自动化验收
- QA 原则：每个任务都包含实现与对应验收
- 证据目录：`.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### 并行波次
> 该任务本身较小，因此按“两个独立 UI 修改 + 一个整体验证”组织。

Wave 1：Footer 精简；首页介绍区重排
Wave 2：首页与共享 Footer 的整体验证

### 依赖矩阵
- 任务 1：无前置；阻塞任务 3
- 任务 2：无前置；阻塞任务 3
- 任务 3：依赖任务 1、任务 2
- F1-F4：依赖任务 3

### Agent 分发摘要
- Wave 1 -> 2 个任务 -> `visual-engineering`, `visual-engineering`
- Wave 2 -> 1 个任务 -> `unspecified-high`
- Final Verification Wave -> 4 个任务 -> `oracle`, `unspecified-high`, `unspecified-high`, `deep`

## TODOs
> 实现与测试必须放在同一个任务中。
> 每个任务都必须包含：Agent Profile、并行信息、QA 场景。

- [ ] 1. 精简共享 Footer 结构

  **What to do**：将 `src/components/Footer.tsx` 从当前 4 列结构收敛成一个更短、更轻的共享 Footer。保留实验室品牌信息、`footer.description`、`footer.copyright`，删除整个 `Quick Links` 区块和整个 `Research Areas` 区块，不保留弱化版、折叠版或隐藏版。整体样式继续沿用当前深色背景和轻玻璃效果，但减少信息块数量与视觉噪音。给 Footer 根节点补一个稳定选择器，例如 `data-testid="site-footer"`，方便后续自动化验证。
  **Must NOT do**：不要新增 router 逻辑；不要保留任何 Footer 内部导航；不要创建首页专属 Footer；不要改写 `footer.description` 与 `footer.copyright` 文案。

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 这是共享 UI 组件的结构与响应式精简任务
  - Skills: [`frontend-ui-ux`] - why needed: 需要在不改变站点风格的前提下优化信息层级
  - Omitted: [`playwright`] - why not needed: 浏览器自动化验证放到后续整体验证任务

  **Parallelization**：Can Parallel: YES | Wave 1 | Blocks: [3] | Blocked By: []

  **References**:
  - Pattern: `src/App.tsx:41` - Footer 是全站共享组件
  - Pattern: `src/components/Footer.tsx:7` - 当前 Footer 根容器样式基线
  - Pattern: `src/components/Footer.tsx:9` - 当前 4 列 grid 结构，需要被替换
  - Pattern: `src/components/Footer.tsx:30` - `Quick Links` 标题与对应区块，整块删除
  - Pattern: `src/components/Footer.tsx:57` - `Research Areas` 标题与对应区块，整块删除
  - Pattern: `src/components/Footer.tsx:81` - 版权区块应保留并重新整理样式
  - Pattern: `src/components/Header.tsx:26` - 参考现有深色半透明壳层语言
  - Pattern: `src/components/Contact.tsx:42` - 参考更克制的卡片边框/阴影处理
  - API/Type: `src/components/LanguageContext.tsx:57` - 保留 `footer.description`
  - API/Type: `src/components/LanguageContext.tsx:60` - 保留 `footer.copyright`

  **Acceptance Criteria**:
  - [ ] `src/components/Footer.tsx` 不再渲染 `Quick Links` / `快速链接`
  - [ ] `src/components/Footer.tsx` 不再渲染 `Research Areas` / `研究领域`
  - [ ] Footer 仍渲染实验室品牌名、`footer.description`、`footer.copyright`
  - [ ] Footer 根节点暴露稳定 QA 选择器（`data-testid="site-footer"` 或等价方案）

  **QA Scenarios**:
  ```text
  Scenario: 首页桌面端 Footer 已完成精简
    Tool: Playwright
    Steps: 本地启动应用；以 1440x900 打开首页；定位 `[data-testid="site-footer"]`；断言 Footer 可见；断言页面中不存在 `Quick Links` 与 `Research Areas`。
    Expected: Footer 仅保留品牌、简介、版权，不再包含冗余列表化信息块。
    Evidence: .sisyphus/evidence/task-1-footer-home-desktop.png

  Scenario: 中文移动端 Footer 无溢出
    Tool: Playwright
    Steps: 以 375x812 打开首页；通过 Header 切换到中文；滚动到 `[data-testid="site-footer"]`；断言中文实验室名称和版权可见；断言页面无横向滚动。
    Expected: Footer 在中文移动端纵向堆叠正常，无裁切、无溢出，也没有 `快速链接`/`研究领域`。
    Evidence: .sisyphus/evidence/task-1-footer-home-mobile-zh.png
  ```

  **Commit**：YES | Message: `feat(homepage): simplify shared footer structure` | Files: [`src/components/Footer.tsx`]

- [ ] 2. 重排首页介绍区，但完整保留现有文案

  **What to do**：重做 `src/components/HomePage.tsx` 中 Hero 下方的介绍区排版，但必须完整保留当前两段英文/中文文案，不删减、不改写、不重组内容逻辑。核心目标是解决“现在这种居中大段文字很丑”的问题，因此新版介绍区必须取消长段正文居中，改为左对齐阅读布局。保留当前 section 的位置与深色背景，容器可以更宽、更规整；允许通过更清晰的标题/eyebrow、分层卡片、段间距、行宽控制和更合理的左右留白来提升观感，但两段正文需要保持原有顺序完整展示。为自动化验收补充稳定选择器，例如 `data-testid="home-intro"`、`data-testid="home-intro-paragraph-1"`、`data-testid="home-intro-paragraph-2"`。
  **Must NOT do**：不要修改 `Hero.tsx`；不要新增 translation key；不要把正文改成居中；不要删除任一段文案；不要把文案拆成摘要版；不要取消该 section。

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 这是首页核心阅读区的版式优化任务
  - Skills: [`frontend-ui-ux`] - why needed: 重点在于版式、留白、层级、可读性优化
  - Omitted: [`playwright`] - why not needed: 自动化验收在任务 3 统一执行

  **Parallelization**：Can Parallel: YES | Wave 1 | Blocks: [3] | Blocked By: []

  **References**:
  - Pattern: `src/components/HomePage.tsx:16` - 当前介绍区整体位置，保持在 Hero 下方
  - Pattern: `src/components/HomePage.tsx:18` - 当前单卡片居中方案，需要被替换
  - Pattern: `src/components/HomePage.tsx:19` - 当前第一段正文使用 `text-center`，这是本次要修正的问题核心
  - Pattern: `src/components/HomePage.tsx:23` - 当前第二段正文也为居中，需要一起改掉
  - Pattern: `src/components/Hero.tsx:65` - Hero 本体不改，仅保持上下衔接关系
  - Pattern: `src/components/Contact.tsx:23` - 可参考更清晰的 section 层级与留白组织方式
  - Pattern: `src/components/Contact.tsx:42` - 可参考更节制的深色卡片壳层风格
  - Pattern: `src/components/previews/ResearchPreview.tsx:45` - 可参考桌面端更合理的内容容器比例，但不要强行变成信息分栏卡片秀
  - API/Type: `src/components/LanguageContext.tsx:25` - 保留 `hero.description1`
  - API/Type: `src/components/LanguageContext.tsx:26` - 保留 `hero.description2`

  **Acceptance Criteria**:
  - [ ] `src/components/HomePage.tsx` 仍然直接使用 `t('hero.description1')` 与 `t('hero.description2')`
  - [ ] 两段正文都完整保留，显示顺序不变
  - [ ] 介绍区根节点与两段正文都暴露稳定 QA 选择器
  - [ ] 桌面端介绍区不再以“长段正文整体居中”的方式展示
  - [ ] 移动端介绍区无横向溢出，中文与英文都能完整显示两段正文

  **QA Scenarios**:
  ```text
  Scenario: 英文桌面端介绍区排版已去除居中长文问题
    Tool: Playwright
    Steps: 以 1440x900 打开首页；滚动到 `[data-testid="home-intro"]`；断言 `[data-testid="home-intro-paragraph-1"]` 与 `[data-testid="home-intro-paragraph-2"]` 可见；截图留证。
    Expected: 两段正文完整显示，整体为左对齐阅读布局，不再是单块居中长文墙。
    Evidence: .sisyphus/evidence/task-2-home-intro-desktop-en.png

  Scenario: 中文移动端介绍区完整且无溢出
    Tool: Playwright
    Steps: 以 375x812 打开首页；切换到中文；滚动到 `[data-testid="home-intro"]`；断言两段正文都可见；执行 `document.documentElement.scrollWidth <= window.innerWidth`。
    Expected: 中文两段文案完整、无裁切、无横向滚动，排版仍清晰。
    Evidence: .sisyphus/evidence/task-2-home-intro-mobile-zh.png
  ```

  **Commit**：YES | Message: `feat(homepage): refine intro section layout` | Files: [`src/components/HomePage.tsx`]

- [ ] 3. 执行整体验证并兜底共享组件回归

  **What to do**：在任务 1 与任务 2 完成后，执行完整验证。先运行 `npm run build`。然后启动本地开发服务，用浏览器自动化覆盖首页在中英文、桌面/移动端下的表现；同时通过 Header 导航进入 `contact` 页面，验证共享 Footer 在非首页也正常显示。若验证中发现的小问题只涉及 `src/components/HomePage.tsx` 或 `src/components/Footer.tsx`，允许在本任务中直接修复后重新验证。
  **Must NOT do**：不要引入新工具；不要把问题修复扩散到无关页面；不要把“人工看起来差不多”当作验收依据。

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: 该任务同时包含构建验证、运行时验证、跨页面回归与小范围修复
  - Skills: [`playwright`] - why needed: 需要做浏览器级断言、切语言、切页面和截图留证
  - Omitted: [`frontend-ui-ux`] - why not needed: 本任务重点是验证与回归，不是设计探索

  **Parallelization**：Can Parallel: NO | Wave 2 | Blocks: [F1, F2, F3, F4] | Blocked By: [1, 2]

  **References**:
  - Pattern: `package.json:58` - 使用现有 `build` / `dev` 脚本
  - Pattern: `vite.config.ts:56` - 已有 dev server 配置
  - Pattern: `src/App.tsx:36` - App shell 中所有页面都带 Footer
  - Pattern: `src/components/Header.tsx:84` - 语言切换入口在 Header
  - Pattern: `src/components/Router.tsx:17` - 页面切换走内部路由状态，非首页验证应通过 UI 导航触发
  - Pattern: `src/components/Footer.tsx:4` - 验证最终 Footer 实现
  - Pattern: `src/components/HomePage.tsx:8` - 验证最终介绍区实现

  **Acceptance Criteria**:
  - [ ] `npm run build` 成功
  - [ ] 首页在 `375x812` 与 `1440x900` 下，中英文都通过浏览器验收
  - [ ] 首页与 Contact 页都能正确渲染精简后的共享 Footer
  - [ ] 已生成首页桌面/移动端与非首页 Footer 验证证据

  **QA Scenarios**:
  ```text
  Scenario: 首页完整 smoke test
    Tool: Bash + Playwright
    Steps: 运行 `npm run build`；启动 `npm run dev -- --host 127.0.0.1 --port 4173`；分别在 1440x900 与 375x812 下打开首页；切换中英文；断言 `[data-testid="home-intro"]` 与 `[data-testid="site-footer"]` 可见；断言无横向溢出。
    Expected: 构建通过，首页在两个断点和两种语言下都正常。
    Evidence: .sisyphus/evidence/task-3-home-smoke.txt and .sisyphus/evidence/task-3-home-responsive.png

  Scenario: 非首页共享 Footer 回归检查
    Tool: Playwright
    Steps: 从首页点击 Header 中的 `Contact` 导航；等待 contact 页面标题出现；滚动到 `[data-testid="site-footer"]`；断言 Footer 可见，且不包含 `Quick Links` 或 `Research Areas`。
    Expected: Footer 精简效果在非首页同样生效，没有布局回归。
    Evidence: .sisyphus/evidence/task-3-contact-footer.png
  ```

  **Commit**：YES | Message: `test(homepage): verify footer and intro layout polish` | Files: [`src/components/HomePage.tsx`, `src/components/Footer.tsx`]

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit - oracle
- [ ] F2. Code Quality Review - unspecified-high
- [ ] F3. Real Manual QA - unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check - deep

## Commit Strategy
- 推荐合并为一个 UI 优化提交
- 推荐提交信息：`feat(homepage): simplify footer and refine intro layout`
- 不要为了试样式产生额外噪声提交

## Success Criteria
- 首页整体观感更干净，但仍然保持当前站点气质
- Footer 明显更短、更轻，不再有冗余信息点
- 首页介绍区完整保留原文，但阅读体验显著优于当前居中长文方案
- 英文和中文在移动端与桌面端都能稳定显示
