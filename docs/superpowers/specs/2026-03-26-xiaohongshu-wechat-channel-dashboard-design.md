# Xiaohongshu And WeChat Channels Dashboard Design

**Date:** 2026-03-26

## Summary

Build an internal operations dashboard for Xiaohongshu accounts and WeChat Channels accounts. The page should make account-level performance immediately visible, then allow the user to drill into platform, account, and content-level detail to identify issues and opportunities. The first usable version should support Excel or CSV import. The data model and UI should be designed so that API-based sync can be added later without redesigning the dashboard.

## Product Goal

The dashboard is for internal use, not public presentation. Its primary job is to answer two questions quickly:

1. What are the current overall results across Xiaohongshu and WeChat Channels?
2. Which account or content item needs attention after viewing the overall results?

Success means the user can open the page, understand high-level performance within seconds, and then filter or drill down into the underlying accounts and content without switching tools.

## Users

Primary user:

- Internal operator reviewing daily or weekly account performance

Secondary future users:

- Internal team members who need quick performance checks
- Managers who may occasionally use the page for lightweight review

The design should optimize for operational clarity and workflow, not for presentation-only visuals.

## Scope

In scope for this design:

- One dashboard page for internal data review
- Excel or CSV import as the first data source
- Unified metrics across Xiaohongshu and WeChat Channels
- Account overview, platform comparison, trend analysis, account ranking, content detail, and anomaly reminders
- Filters for time range, platform, account, and content type
- Data modeling that supports later API sync

Out of scope for the first implementation:

- Direct live integration with Xiaohongshu or WeChat Channels APIs
- Public-facing branding site behavior
- Multi-user permissions
- Complex real-time push updates such as websocket streaming
- Deep report export workflows

## Recommended Product Direction

The recommended direction is an `operations overview dashboard`.

Why this approach:

- It matches the user workflow: see results first, then investigate problems
- It balances account-level and content-level visibility
- It fits internal daily use better than a visual big-screen or content-only analysis page

Alternative directions considered:

1. Content analysis-first dashboard
   - Better for editorial review
   - Weaker for account-level monitoring
2. Presentation big-screen dashboard
   - Strong visual impact
   - Poorer day-to-day drill-down usability

## Information Architecture

The page should be structured in five major sections from top to bottom.

### 1. Filter Bar

Purpose:

- Control the dataset shown across the full page

Controls:

- Time range: last 7 days, last 30 days, custom range
- Platform: all, Xiaohongshu, WeChat Channels
- Account selector
- Content type selector

Behavior:

- Filter changes update all downstream charts and tables
- The default view should open on last 30 days with all platforms selected

### 2. KPI Overview

Purpose:

- Provide an immediate summary of overall health

Recommended KPI cards:

- Number of tracked accounts
- Total followers
- Follower growth in last 7 days
- Follower growth in last 30 days
- Total published content
- Total exposure
- Average engagement rate

Design notes:

- Large typography for key values
- Clear secondary labels
- Trend deltas can appear inline where helpful

### 3. Platform Comparison

Purpose:

- Compare Xiaohongshu and WeChat Channels side by side

Recommended content:

- Core metrics by platform
- Contribution share by platform
- Short trend visualization per platform

Behavior:

- Each platform card can act as a filter shortcut
- Clicking a platform narrows rankings and content detail below

### 4. Account Ranking

Purpose:

- Surface top and weak-performing accounts quickly

Recommended ranking dimensions:

- Follower growth
- Engagement rate
- Exposure
- Publishing efficiency

Behavior:

- Sort switching should be fast
- Clicking an account filters the content detail section

### 5. Content Detail And Anomaly Area

Purpose:

- Support drill-down after the high-level review

Recommended content:

- Content performance table
- Top-performing items
- Low-performing items
- Anomaly or warning cards

Example anomaly prompts:

- Posting frequency down over the last 7 days
- Engagement rate down for a selected account
- Exposure down despite stable posting volume

## Data Model

The design should use three logical layers of data.

### Account Layer

Fields:

- Platform
- Account name
- Current followers
- Total published content
- Follower growth over 7 days
- Follower growth over 30 days
- Total exposure
- Total engagement
- Engagement rate

Used by:

- KPI cards
- Platform comparison
- Account rankings

### Content Layer

Fields:

- Platform
- Account name
- Content title
- Publish time
- Content type
- Views or plays
- Likes
- Favorites
- Comments
- Shares
- Engagement rate
- Follower gain contribution

Used by:

- Content detail table
- High and low performer discovery
- Content-level filtering

### Trend Layer

Aggregation:

- Daily or weekly aggregation by date, platform, and account

Fields:

- Date
- Platform
- Account
- Publish count
- Exposure
- Engagement
- Follower growth

Used by:

- Trend charts
- Period-over-period review

## Data Source Strategy

### Phase 1: Excel Or CSV Import

The first implementation should support importing Excel or CSV files and immediately rendering the dashboard after parsing and validation.

Goals:

- Make the dashboard useful without waiting for API work
- Validate the data model and interaction model early
- Keep operational setup simple

### Phase 2: Sync-Ready Data Adapter Layer

The system should normalize imported data into a unified internal schema. This schema should not be tied to Excel-specific field names. That allows later addition of:

- Xiaohongshu adapter
- WeChat Channels adapter
- Custom internal data service adapter

### Phase 3: Refresh And Sync UX

When API integration exists later, the page should support:

- Last sync time display
- Manual refresh action
- Optional scheduled sync

The design explicitly does not require true streaming real-time updates in the first version. Operationally, timestamped refresh is sufficient and substantially lower risk.

## Import And Validation Rules

The import flow should handle common operational issues explicitly.

Required behaviors:

- Detect missing required columns and show a clear error message naming the missing fields
- Normalize platform-specific column names into the unified schema
- Prevent duplicate counting when the same account-day dataset is imported more than once
- Handle empty metric fields safely by using explicit empty-state logic or zero values where appropriate
- Keep large content datasets usable with pagination, sorting, and filtering

## Visual Design Direction

The visual style should feel like an operations cockpit rather than a presentation screen.

Guidelines:

- Clean and information-dense without looking noisy
- Strong hierarchy on important numbers
- Charts should be simple and legible before they are decorative
- Tables should optimize scanning speed

Color direction:

- Xiaohongshu: warm red or orange-accented identity
- WeChat Channels: cool blue or cyan-accented identity
- Neutral background and card surfaces to keep the dashboard professional and readable

The page should communicate platform distinction clearly without splitting into two disconnected products.

## Interaction Model

The dashboard should support a top-down review flow.

Default workflow:

1. Open dashboard and read high-level KPI state
2. Compare Xiaohongshu and WeChat Channels
3. Check trends and rankings
4. Drill into the content table for diagnosis

Interaction requirements:

- Global filters update all sections
- Platform and account clicks drive linked filtering in lower sections
- Trend range defaults to 30 days and can switch to 7 days
- Rankings and content table should support sorting

## Error Handling And Empty States

The UI should stay stable when data is incomplete or invalid.

Required states:

- Empty import state before any file is uploaded
- Invalid file state
- Missing required field state
- No matching data for current filters state
- Partially populated metrics state

Each state should explain what happened and what the user can do next.

## Testing Requirements

The eventual implementation should cover four areas.

### Import Tests

- File parsing
- Field mapping
- Missing-column detection
- Duplicate import handling

### Aggregation Tests

- KPI calculations
- Platform comparisons
- Trend aggregation
- Ranking calculations

### Interaction Tests

- Filter updates
- Cross-section drill-down behavior
- Sorting
- Time-range switching

### Error And Edge Tests

- Empty data
- Invalid formats
- Partial records
- Large content tables

## Architecture Guidance For Implementation

The implementation should separate concerns into four functional parts:

1. Import layer
   - Handles Excel or CSV upload and parsing
2. Normalization layer
   - Maps source-specific columns into a unified schema
3. Storage and aggregation layer
   - Holds imported records and computes dashboard-ready data
4. Data source adapter layer
   - Supports later API-backed sync without changing the dashboard structure

This boundary keeps the UI stable while data ingestion evolves.

## Final Recommendation

Build one internal dashboard page with:

- Account overview first
- Content analysis second
- Excel or CSV import first
- API-ready data normalization built in from day one

This gives the user a useful operational tool immediately while preserving a clean path to future synchronized updates.
