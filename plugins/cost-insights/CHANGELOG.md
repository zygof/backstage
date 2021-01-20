# @backstage/plugin-cost-insights

## 0.5.7

### Patch Changes

- 8c2437c15: bug(cost-insights): Remove entity count when none present
- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
  - @backstage/core@0.5.0

## 0.5.6

### Patch Changes

- 9e9504ce4: Minor wording change in UI

## 0.5.5

### Patch Changes

- ab0892358: Remove test dependencies from production package list

## 0.5.4

### Patch Changes

- 3fca9adb9: Fix links in sample instructions
- Updated dependencies [a08c32ced]
  - @backstage/core@0.4.3

## 0.5.3

### Patch Changes

- c02defd57: Make alert url field optional

## 0.5.2

### Patch Changes

- 48c305e69: pin all projects selection to the top of menu list
- Updated dependencies [8ef71ed32]
  - @backstage/core@0.4.1

## 0.5.1

### Patch Changes

- 64c9fd84c: fix breakdown sorting
- Fix bar chart legend label bug for unlabeled dataflow alerts

## 0.5.0

### Minor Changes

- e3071a0d4: Add support for multiple types of entity cost breakdown.

  This change is backwards-incompatible with plugin-cost-insights 0.3.x; the `entities` field on Entity returned in product cost queries changed from `Entity[]` to `Record<string, Entity[]`.

- d6e8099ed: convert duration + last completed billing date to intervals
- 88ef11b45: Remove calendar MoM period option and fix quarter end date logic

### Patch Changes

- 90458fed6: fix react-hooks/exhaustive-deps error
- Updated dependencies [2527628e1]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e1f4e24ef]
- Updated dependencies [1c69d4716]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
- Updated dependencies [e3bd9fc2f]
  - @backstage/core@0.4.0
  - @backstage/config@0.1.2
  - @backstage/test-utils@0.1.5
  - @backstage/theme@0.2.2

## 0.4.2

### Patch Changes

- fe7257ff0: enable SKU breakdown for unlabeled entities
- a2cfa311a: Add breakdown view to the Cost Overview panel
- 69f38457f: Add support for non-SKU breakdowns for entities in the product panels.
- bec334b33: disable support button
- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError
- 00670a96e: sort product panels and navigation menu by greatest cost
  update tsconfig.json to use ES2020 api
  - @backstage/test-utils@0.1.4

## 0.4.1

### Patch Changes

- 8e6728e25: fix product icon configuration
- c93a14b49: truncate large percentages > 1000%
- Updated dependencies [475fc0aaa]
  - @backstage/core@0.3.2

## 0.4.0

### Minor Changes

- 4040d4fcb: remove cost insights currency feature flag

### Patch Changes

- 1722cb53c: Added configuration schema
- 17a9f48f6: remove excessive margin from cost overview banner
- f360395d0: UI improvements: Increase width of first column in product entity dialog table
  UI improvement: Display full cost amount in product entity dialog table
- 259d848ee: Fix savings/excess display calculation
- Updated dependencies [1722cb53c]
  - @backstage/core@0.3.1
  - @backstage/test-utils@0.1.3

## 0.3.0

### Minor Changes

- 0703edee0: rename: Tooltip -> BarChartTooltip
  rename: TooltipItem -> BarChartTooltipItem
  Deprecate BarChartData in favor of BarChartOptions
  Export BarChartLegend component
  Update BarChart props to accept options prop
  Deprecate ProductCost type in favor of Entity. Update CostInsightsApi

### Patch Changes

- 9a294574c: Fix styling issue on Cost Insights product panels with no cost
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- cab473771: This PR adds Spotify's Cost Insights Tool. Cost Insights explains costs from cloud services in an understandable way, using software terms familiar to your engineers. This tool helps you and your team make trade-offs between cost optimization efforts and your other priorities.

  Cost Insights features:

  Daily cost graph by team or billing account
  Cost comparison against configurable business metrics
  Insights panels for configurable cloud products your company uses
  Cost alerts and recommendations
  Selectable time periods for month over month, or quarter over quarter cost comparison
  Conversion of cost growth into average engineer cost (configurable) to help optimization trade-off decisions

  ![plugin-cost-insights](https://user-images.githubusercontent.com/3030003/94430416-e166d380-0161-11eb-891c-9ce10187683e.gif)

  This PR adds the Cost Insights frontend React plugin with a defined CostInsightsApi. We include an example client with static data in the expected format. This API should talk with a cloud billing backend that aggregates billing data from your cloud provider.

  Fixes #688 💵

- bb48b9833: Added getLastCompleteBillingDate to the CostInsightsApi to reason about completeness of billing data
- 6a84cb072: Enable custom alert types in Cost Insights
- e7d4ac7ce: - getProjectDailyCost and getGroupDailyCost no longer accept a metric as a parameter
  - getDailyMetricData added to API for fetching daily metric data for given interval
  - dailyCost removed as configurable metric
  - default field added to metric configuration for displaying comparison metric data in top panel
  - Metric.kind can no longer be null
  - MetricData type added
- 0e67c6b40: Remove product filters from query parameters

### Patch Changes

- 8d1360aa9: export test utilities for mocking context
- 0ee9e9f66: migrate type utilities out of type definition files
- 5c70f3d35: expose alerts utilities for export
- fd8384d7e: prefer named exports
- 26e69ab1a: Remove cost insights example client from demo app and export from plugin
  Create cost insights dev plugin using example client
  Make PluginConfig and dependent types public
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/core@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
